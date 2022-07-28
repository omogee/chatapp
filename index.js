const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const mysql = require("mysql")
const {AddUser,removeUser, getConnectedUsers, getCurrentUser, addTypingUser, getTypingALLUsers,removeTypingUser} = require("./utils")

const app = express()

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))  
app.use(bodyParser.json())   

const conn = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: 'localhost',
    user: 'root',
    //b9b001ef539d5b 
    password: 'password',
    //8b36306e 
    database: 'chatapp',
    //heroku_ea5621dea112dad 
    multipleStatements: true,
   // connectionLimit : 20,  
    waitForConnections : true
})
io.on("connection", socket =>{
    setInterval(() => {
        socket.emit("ping")
        console.log('pong')
    }, (20000));

    socket.on("addUser", id =>{
        const user = AddUser({userId:id,socketId:socket.id})
        console.log("user",user)
        const connections = getConnectedUsers()
       io.emit("online users", connections)
    })   
    socket.on("removeUser", id =>{
        const user = removeUser(id)
        const connections = getConnectedUsers()
        io.emit("online users", connections)
    })
    socket.on("typing", (data)=>{
     const typer = getCurrentUser(data.typingclient)
     const typee = getCurrentUser(data.recievingclient)
     const typers = addTypingUser(data)
     if((typee && typee.socketId) && (typer && typer.userId)){
       socket.broadcast.to(typee.socketId).emit("incomingmessage", typer.userId)
       socket.broadcast.to(typee.socketId).emit("typers", typers)  
     }    
    })
    socket.on("set all messages to read", data=>{
        const sender = getCurrentUser(data.sender)
        if(sender){
        console.log(" i have told ", sender.socketId, "to set messages to read")
        socket.broadcast.to(sender.socketId).emit("set messages to read", data)
        conn.query("update messages set status =? where sender=? and reciever=? and status !=?",["seen",data.sender,data.reciever,"seen"],(err, result)=>{
            console.log("message status updated in db ")
        })
        }
    })
    socket.on("send message", data =>{
      const sender = getCurrentUser(data.sender)
     const reciever = getCurrentUser(data.reciever)
     if(reciever && reciever.socketId && sender && sender.socketId){
         console.log("message sent to", reciever.socketId)
         socket.broadcast.to(reciever.socketId).emit("recieving message", data)
         data["status"] = "delivered"
         socket.emit("delivered", data)
         socket.emit("sending message", data)
         console.log("data",data)
         let d = new Date()
         const todaydate = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`
           conn.query("insert into messages (connId,message,sender,reciever, date, time,status) values (?,?,?,?,?,?,?)",[data.connid,data.message,parseInt(data.sender),parseInt(data.reciever),todaydate,d.getTime(),"delivered"], (err, result) =>{
                if (err) throw err;
                console.log("message inserted in db")
            })
     }
      else if(sender && sender.socketId){
        data["status"] = "sent"
        socket.emit("delivered", data)
         socket.emit("sending message", data)
         let d = new Date()
         const todaydate = `${d.getDay()}/${d.getMonth()}/${d.getFullYear()}`
           conn.query("insert into messages (connId,message,sender,reciever, date, time,status) values (?,?,?,?,?,?,?)",[data.connid,data.message,parseInt(data.sender),parseInt(data.reciever),todaydate,d.getTime(),"sent"], (err, result) =>{
                if (err) throw err;
                console.log("message inserted in db")
            })
     }

    })
     socket.on("untyping", (data)=>{
     const typer = getCurrentUser(data.typingclient)
     const typee = getCurrentUser(data.recievingclient)
     const typers = removeTypingUser(data)
     console.log(typers)
     if((typee && typee.socketId) && (typer && typer.userId)){
       socket.broadcast.to(typee.socketId).emit("incomingmessage", typer.userId)
       socket.broadcast.to(typee.socketId).emit("typers", typers)  
     }    
    })
    socket.on('disconnect', () => { 
        socket.emit("disconnected")
    console.log('A client just left'); 
    const userleaving = removeUser(socket.id); 
    console.log(userleaving)
   if(userleaving && userleaving.userId){
       const d = new Date()
    io.emit("lastseen",userleaving)
       console.log("userleaving",userleaving)
       conn.query("update users set lastseen = ? where userid =?",[d.getTime(), parseInt(userleaving.userId)], (err, result)=>{
           if (err) throw err;
           console.log("lastseen updated in db")
       })
   }
   //  const d = new Date();  id
    // const lastseen = d.getTime();  
    /* if(userleaving !== undefined){
       let lastseens ={id:userleaving.userId,time:lastseen}
      conn.query("update user set lastseen =?, userStatus =? where userId =?",[lastseen,"offline",userleaving.userId],(err,update)=>{
        if (err) throw err;
        console.log("done")
    io.emit('message',`${userleaving !== undefined ? userleaving.userId : null} just left at ${lastseen}`);
    }) 
    }     */
      const getUsers = getConnectedUsers()
      io.emit("online users", getUsers) 
     });                     
  });     
  app.get("/create-group",(req,res)=>{
    let group = req.query.group
    group = JSON.parse(group)
    console.log(group)
    const ownerid = group.ownerid
    const grouptitle = group.grouptitle
    const groupabout = group.groupabout
    let time = new Date().getTime()

    conn.query("select * from chatgroups where title = ?", [grouptitle],(err, groupIspresent) =>{
    if (err) throw err;
    if(groupIspresent && groupIspresent.length > 0){
        res.json({message:"group name already exist", status:"fail"})
    }else{
        conn.query("insert into chatgroups (admin, about,title,time) values (?,?,?,?)",[ownerid,groupabout, grouptitle,time],(err, inserted)=>{
            if (err) throw err;
            res.json({message:"group created successfully", status:"sucess"})
        })
    }
    })
  })
  app.get("/fetch-group", (req,res)=>{
    let ownerid = req.query.ownerid
    console.log("owner", ownerid)
    conn.query("select * from users where userid = ?", [ownerid], (err, user)=>{
        if (err) throw err;
        if ( user && user.length > 0){
    conn.query(`select * from chatgroups where admin = ?`,[ownerid],(errTwo, groups)=>{
        if (errTwo) throw errTwo;   
        res.json({user,groups, status:"success"})
    })
}else{
    res.json({message:"User does not exist", status:"fail"})
}
    })
  })
app.get("/fetch-messages", (req,res)=>{
    console.log(req.query.conn1,req.query.conn2, "req.query.connId")
    conn.query(`select connId from connections where (conn1 = ? and conn2 = ?) or (conn2 =? and conn1=?)`,[parseInt(req.query.conn1),parseInt(req.query.conn2),parseInt(req.query.conn1),parseInt(req.query.conn2)], (err, connidentity)=>{
        if (err) throw err;
        if(connidentity && connidentity[0]){
        conn.query("select * from messages inner join connections on (messages.connId = connections.connid) where messages.connId = ?", [connidentity[0].connId], (err, result)=>{
            if (err) throw err;
            res.send(result)
        })
    }else{
        res.send([])
    }
    })
})
app.get("/fetch-users",(req,res)=>{
    conn.query("select * from users where userid != ?",[req.query.id],(err, users)=>{
        if (err) throw err;
        res.send(users)
    })
})
app.get("/fetch-pendingconnections",(req,res)=>{
    conn.query("select conn2 from pendingconnections where conn1 =?",[req.query.requestid],(err, requestedconn)=>{
        if (err) throw err;
        conn.query("select conn1 from pendingconnections where conn2 =?",[req.query.requestid],(err, pendingconn)=>{
            if (err) throw err;
            console.log("requested",{pendingconn,requestedconn})
        res.json({pendingconn,requestedconn})
        })
    })
})
app.get("/fetch-connections",(req,res)=>{
    conn.query(`SELECT 
    *
FROM
    connections 
        INNER JOIN
    users  ON connections.conn1 = users.userid or connections.conn2 = users.userid
    LEFT OUTER JOIN (select distinct * from messages order by id DESC) as messagee  ON messagee.connId = connections.connid where (connections.conn1=? or connections.conn2=?) and users.userid != ?
    group by connections.connid `,[req.query.id,req.query.id,req.query.id],(err, connections)=>{
        if (err) throw err;
   
      //  console.log(connections) ON connections.conn1 = users.userid or connections.conn2 = users.userid  where users.userid !=
        res.send(connections)
    })
})
app.get("/fetch-user",(req,res)=>{
    conn.query("select * from users inner join connections  on users.userid = connections.conn1 or users.userid=connections.conn2  where  (connections.conn1=? and connections.conn2=? and users.userid=? ) or (connections.conn1=? and connections.conn2=? and users.userid=? )",[req.query.inboxuserId,req.query.mainuserId,req.query.inboxuserId,req.query.mainuserId,req.query.inboxuserId,req.query.inboxuserId],(err, users)=>{
        if (err) throw err;
        res.send(users)
    })
})
app.get("/login", (req,res)=>{
    conn.query(`select userid,username from users where (email =? or username=?) and password=?`,[req.query.name,req.query.name,req.query.password],(err, user)=>{
        if (err) throw err;
        if (!user || user.length === 0){
            console.log("it is lesser")
            res.json({message:"failed", reason:"incorrect login details"})
        }else{
          console.log("it is greater")
            res.json({message:"success", user})
        }
    })
    
})
app.post("/register", (req,res)=>{
    const body = JSON.parse(req.body.data)
    conn.query(`insert into users (name,username, email, gender, contact, password) values (?,?,?,?,?,?)`,[body.name,body.username,body.email,body.gender,body.contact,body.password],(err, file)=>{
      if(err){
          res.json({message:"failed"})
      }else if(file){
        res.json({message:"success",data:body})
    }else{
        res.json({message:"failed"})
    }
    })
})
if(process.env.NODE_ENV === "production"){ 
    app.use(express.static("frontend/build"))
    
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, 'frontend','build', 'index.html'));
    })
    }  
server.listen(5000, ()=>{
    console.log("port running on 5000 ogbonnaya")
})