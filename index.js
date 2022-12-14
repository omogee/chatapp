const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require("path")    
const mysql = require("mysql")
const fs = require("fs")
const nodemailer = require("nodemailer")

const multer = require("multer")
const cloudinary = require("cloudinary")
const {AddUser,removeUser, getConnectedUsers, getCurrentUser, addTypingUser, getTypingALLUsers,removeTypingUser} = require("./utils")
require('dotenv').config()
const app = express()

const server = http.createServer(app);
const { Server } = require("socket.io");
const e = require("express")
const io = new Server(server);
/**
 * create a transporter object,
 * create a mail option object,
 * use the transporter.sendMail method top send mail
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yexies4ogb@gmail.com',
      pass: 'oszwncszxcxqsajh'
    }
})
transporter.verify(function(error, success) {
    if (error) {
          console.log(error);
    } else {
          console.log('Server is ready to take our messages');
    }
  });


// app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))  
app.use(bodyParser.json())   
app.use((req, res, next)=>{
   console.log("i am in the index page")
    next()
})

app.use((req,res,next)=>{
    console.log("i am here")
   const promise = new Promise((resolve, reject)=>{
    let usersTodelete = []
    conn.query(`select * from users where confirmed != ?`,["true"], (err, users)=>{
        if(users && users[0]){
        users.forEach(user =>{
            let current_date = new Date().getTime()
            if (parseInt(current_date) - parseInt(user.reg_time) > 1000){
                usersTodelete.push(user.userid)
            }

        })
    }
    resolve(usersTodelete)
    })
   }) 
   promise.then(data => {
    conn.query(`select * from users where userid IN (${data})`, (err, falseusers)=>{
        if (err) throw err;
      //  console.log("falseusers", falseusers)
    })
   })
    next()
})
const loginMail =(req, res, next)=>{
   const authuser = req.query.id  ? true : false
   console.log("req.query.name", req.query.name)
    if(authuser){
        return res.status("404").send("Not Found")
    }else{
        const emailPromise = new Promise((resolve, reject)=>{
            if(req.query.name && req.query.name.includes("@")){
                resolve(req.query.name)
               }else{
               conn.query("select email from users where email =? or username=? ",[req.query.name, req.query.name], (err, useremail)=>{
                if (err) throw err;
                console.log("useremail",req.query.name, useremail)
                if(useremail[0] && useremail[0].email){
                  resolve(useremail[0].email)
                }
               })
               }
        })
     emailPromise.then(data =>{
        console.log("data", data)
        const mailOptions ={
            from: '"Login Successfully On This Device" <yexies4ogb@gmail.com>',
            to: `${data}`,
            subject: 'Hurray, Welcome Back !!!',
            text: 'Hey there, it???s our first message sent with Nodemailer ;) ',
            html: `<b>Hey there! </b><br> You are recieving this message because we believe you just logged into your hormel chat account...<br/>
            <br/>
            Remember to chat and connect with friends from all over the world in just a click>>><br/><br/>
            To enjoy limitless contacts and friends ever willing to chat and link up kindly click on this button to enjoy over 2million subscribers worldwide<br/><br/>
            <a href="">
            <button>Click Me!</button>
            </a> ` }
        transporter.sendMail(mailOptions, (error, info)=>{
            if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
        })
     })
        next()
    }
}
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
/**
 *    host: 'us-mm-auto-dca-06-b.cleardb.net',
    user: 'b0d30b2e7ab02c',
    //b9b001ef539d5b 
    password: '59dc8abb',
    //8b36306e 
    database: 'heroku_fc784cdf41a7785',

      host: 'localhost',
    user: 'root',
    //b9b001ef539d5b 
    password: 'password',
    //8b36306e 
    database: 'chatapp',
 */
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  })
  const d= new Date()
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, "./frontend/uploads")
    },
    filename:(req, file,cb)=>{
        cb(null, Date.now() +"_"+file.originalname)
    }
})
const uploads = multer({
storage,
// limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        const err = new Error('Only .png, .jpg and .jpeg format allowed!')
        err.name = 'ExtensionError'
        return cb(err);
    }
}
})
io.on("connection", socket =>{
  /*  setInterval(() => {
        socket.emit("ping")
        console.log('pong')
    }, (100000));
*/
    socket.on("addUser", id =>{
        const user = AddUser({userId:id,socketId:socket.id})
        const ownerid = id
        const connections = getConnectedUsers()
       io.emit("online users", connections)
       conn.query(`select title from chatgroups where members Like ? OR members Like ? OR members Like ? OR members = ?`,
       [`%${ownerid}%`,`[${ownerid}%`,`%,${ownerid}]`,`[${ownerid}]`],(err, groups)=>{
           if (err) throw err;   
           if (groups && groups.length > 0){
             groups.map(group=>{
                socket.join(group.title)
             })
           }
       })
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
        console.log("sender is here", data, sender)
        if(sender){
        socket.broadcast.to(sender.socketId).emit("set messages to read", data)
        console.log("no sender here", data)
        conn.query("update messages set status =? where sender=? and reciever=? and status !=?",["seen",data.sender,data.reciever,"seen"],(err, result)=>{
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
    socket.on("room_message",data =>{
        console.log("room_message", data)
        io.to(data.room).emit("room_message_delivery", data)
        conn.query(`insert into groupmessages (groupid,sender,type,message,time,date,status) values (?,?,?,?,?,?,?)`,
        [data.room_id,data.sender,data.type, data.message, data.time,data.time, "sent"], (err, done)=>{
            if(err) throw err;
            if (done){
               console.log("done")
            }
        })
    })
    socket.on("typing_group", data=>{
        console.log("a user is typing to a group",data)  
        if(data && data.room){    
        io.to(data.room).emit("typing_group_broadcast", data)       
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
            res.json({message:"group created successfully", status:"success"})
        })
    }
    })
  })
  app.get("/join-group", (req,res)=>{
    let ownerid = req.query.ownerid
    conn.query("select members from chatgroups where groupId =?",[req.query.groupid], (err, members)=>{
        if (err) throw err;
        let oldmembers = members[0].members;
        oldmembers = JSON.parse(oldmembers)
        oldmembers.push(parseInt(ownerid))
        oldmembers = JSON.stringify(oldmembers)
        conn.query("update chatgroups set members = ? where groupId =?",[oldmembers, req.query.groupid], (err, done)=>{
            if (err) throw err;
            if (done){
                console.log(oldmembers)
                res.json({status:"success",newmembers:oldmembers})
            }
        })
    })
  })
  app.get("/fetch-groupmessages", (req,res)=>{
    conn.query("select * from groupmessages inner join users on (groupmessages.sender = users.userid) where groupid =?",[req.query.groupid],(err, savedmessages)=>{
        if (err) throw err;
        if ( savedmessages){
            res.json({status:"success", savedmessages:savedmessages})
        }
    })
  })
  app.get("/fetch-group", (req,res)=>{
    let ownerid = req.query.ownerid
    console.log("owner", ownerid)
    conn.query("select * from users where userid = ?", [ownerid], (err, user)=>{
        if (err) throw err;
        // Like '%,1,%%' OR members Like '[1,%' OR members Like '%,1]' OR members = '[1]
        if ( user && user.length > 0){
    conn.query(`select * from chatgroups where members Like ? OR members Like ? OR members Like ? OR members = ?`,
    [`%${ownerid}%`,`[${ownerid}%`,`%,${ownerid}]`,`[${ownerid}]`],(errTwo, groups)=>{
        if (errTwo) throw errTwo;   
        res.json({user,groups, status:"success"})
    })
}else{
    res.json({message:"User does not exist", status:"fail"})
}
    })
  })
app.get("/fetch-messages", (req,res)=>{
    
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
    console.log("fetching users ")
    conn.query("select * from users where userid != ?",[req.query.id],(err, users)=>{
        if (err) throw err;
        res.send(users)
    })
})

app.get("/fetch-justuser",(req,res)=>{
    conn.query("select * from users where userid = ?",[req.query.id],(err, user)=>{
        if (err) throw err;
        if(user){
            //select COUNT (*) AS messageee from (select * from messages where reciever="+req.query.id+" and status =? group by sender) as mess order by id desc",["delivered"]
            conn.query("select * from messages inner join users on messages.sender = users.userid where reciever="+req.query.id+" and status =? group by sender order by id desc; select * from messages inner join users on messages.sender=users.userid where reciever="+req.query.id+" and status =? ",["delivered","delivered"],(err, unreadmessages)=>{
                if(err) throw err;
             conn.query("select * from messages where reciever = ? order by id DESC limit 1", [req.query.id], (err, lastmessagerow)=>{
                if (err) throw err;
                console.log("lastmessagerow",lastmessagerow[0].sender)
                //unreadmessages[unreadmessages.length -1] && unreadmessages[unreadmessages.length -1]
        res.json({status:"success", user:user[0],noOfUnreadMessages:unreadmessages[1],noOfUnreadChat:unreadmessages[0],lastunreadindex:lastmessagerow[0].sender})
    })
})
        }
    })
})

app.get("/fetch-user",(req,res)=>{
    conn.query("select * from users inner join connections  on users.userid = connections.conn1 or users.userid=connections.conn2  where  (connections.conn1=? and connections.conn2=? and users.userid=? ) or (connections.conn1=? and connections.conn2=? and users.userid=? )",[req.query.inboxuserId,req.query.mainuserId,req.query.inboxuserId,req.query.mainuserId,req.query.inboxuserId,req.query.inboxuserId],(err, users)=>{
        if (err) throw err;
    if(users.length > 0){
        res.send(users)
    }else{
        conn.query("select * from users where userid=? ",[req.query.inboxuserId],(err, user)=>{
            if (err) throw err;
            res.send(user)
        })
    }
    })
})
app.get("/fetch-connections",(req,res)=>{
    conn.query("select conn2 from pendingconnections where conn1 =?",[req.query.id],(err, pendingconn)=>{
        if (err) throw err;
        conn.query("select conn1 from pendingconnections where conn2 =?",[req.query.id],(err, requestedconn)=>{
            if (err) throw err;
    conn.query(`SELECT 
    *
FROM
    connections 
        INNER JOIN
    users  ON connections.conn1 = users.userid or connections.conn2 = users.userid
    LEFT OUTER JOIN (select distinct * from messages order by id DESC) as messagee  ON messagee.connId = connections.connid where (connections.conn1=? or connections.conn2=?) and users.userid != ?
    group by connections.connid order by messagee.id desc`,[req.query.id,req.query.id,req.query.id],(err, connections)=>{
        if (err) throw err;
   //console.log(connections)
      //   ON connections.conn1 = users.userid or connections.conn2 = users.userid  where users.userid !=
      res.json({pendingconn,requestedconn,connections})
    })
})
    })
})
app.post("/change-profilepic", uploads.single("files"), (req,res)=>{
    cloudinary.v2.uploader.upload(
        req.file.path,
        {folder: "chatapp/profilepicture"},
        (error,result)=>{
            if (error) throw err;
            const image = `${result.original_filename}.${result.original_extension}`
            conn.query("update users set image = ? where userid =?",[image, req.body.id],(err, updated)=>{
                if (err) throw err;
                if(updated){
                    console.log("profile pic done", image)
                    res.json({status:"success"})
                }
            })
        }
    )
})
app.get("/fetch-groupinfo",(req,res)=>{
    conn.query("select * from chatgroups where groupid = ?", [req.query.groupid], (err, groupdetails)=>{
        if (err) throw err;
  
     if(groupdetails[0].members){
     conn.query("select * from users where userid IN ("+JSON.parse(groupdetails[0].members)+")", (err, members)=>{
        if (err) throw err;
        console.log("groupmembers", members.length)
        res.json({status:"success", groupdetails:groupdetails[0], groupmembers:members})
     })
     }
    })
})
app.get("/fetch-groups",(req,res)=>{
    conn.query("select * from chatgroups", (err, groups)=>{
        if (err) throw err;
        console.log("this are all the groups", groups)
        res.json({status:"success", groups})
    })
})
app.post("/change-backgroundimage",uploads.single("files"),(req,res)=>{
    cloudinary.v2.uploader.upload(
        req.file.path,
        {folder: "chatapp/backgroundimage"},
        (error,result)=>{
            if (error) throw err;
            const image = `${result.original_filename}.${result.original_extension}`
            conn.query("update users set backgroundImage = ? where userid =?",[image, req.body.id],(err, updated)=>{
                if (err) throw err;
                if(updated){
                    console.log("backgroundImage pic done", image)
                    res.json({status:"success"})
                }
            })
        }
    )
})
//possible outcome %1, 1%, %1%,%[1, %]
app.get("/follow-user", (req, res)=>{
    conn.query("select followers from users where userid =?",[req.query.otheruser],(err, followers)=>{
        if (err) throw err;
        conn.query("select following from users where userid =?",[req.query.mainuser],(err, following)=>{
            if (err) throw err;
     if(followers && following){
     let prevfollowers =  JSON.parse(followers[0].followers)
     let prevfollowing =  JSON.parse(following[0].following)

if((prevfollowers && prevfollowing && (prevfollowers.includes(req.query.mainuser) || prevfollowers.includes(parseInt(req.query.mainuser)))  && (prevfollowing.includes(req.query.otheruser) || prevfollowing.includes(parseInt(req.query.otheruser))))){
         prevfollowers = prevfollowers.filter(prev => prev != parseInt(req.query.mainuser))
         prevfollowing = prevfollowing.filter(prev => prev != parseInt(req.query.otheruser))
         console.log("its included", prevfollowers, prevfollowing)
         conn.query("update users set followers = ? where userid =?",[JSON.stringify(prevfollowers), req.query.otheruser],(err, updatedfollowers)=>{
            if (err) throw err;
         conn.query("update users set following = ? where userid =?",[JSON.stringify(prevfollowing), req.query.mainuser],(err, updatedfollowing)=>{
                if (err) throw err;
            console.log("unfollowed",prevfollowers)
            if(updatedfollowers && updatedfollowing){
                res.json({status:"success",followers:prevfollowers, following:prevfollowing})
            }
        })
         })
        }else if((!prevfollowers.includes(req.query.mainuser) || !prevfollowers.includes(parseInt(req.query.mainuser)) && !prevfollowing.includes(req.query.otheruser) || !prevfollowing.includes(parseInt(req.query.otheruser)))){
        prevfollowers = [...prevfollowers, parseInt(req.query.mainuser)]
        prevfollowing = [...prevfollowing, parseInt(req.query.otheruser)]
       // prevfollowers.push(parseInt(req.query.id))
         console.log("its not included", prevfollowers, prevfollowing)
         conn.query("update users set followers = ? where userid =?",[JSON.stringify(prevfollowers), req.query.otheruser],(err, updatedfollowers)=>{
            if (err) throw err;
            conn.query("update users set following = ? where userid =?",[JSON.stringify(prevfollowing), req.query.mainuser],(err, updatedfollowing)=>{
                if (err) throw err;
            console.log("followed",prevfollowers)
            if(updatedfollowers && updatedfollowing){
                res.json({status:"success", followers:prevfollowers, following: prevfollowing})
            }
        })
         })
        }else{
            res.json({status:"failed"})
        }
     }
    })
    })
})
app.get("/fetch-userprofile",(req,res)=>{
    const otherid = req.query.id
    const ownerid = req.query.ownerid
    if(!ownerid){
       res.json({status:"failed", reason:"couldnt find user"})
    }else{
    conn.query(`select * from users inner join uploads on users.userid=uploads.userid where users.userid =? order by uploads.uploadid ASC;
    select * from chatgroups where (members like ? or members like ? or members like ? or members like ?) 
    AND (members like ? or members like ? or members like ? or members like ? ) `,
    [otherid,`%,${otherid},%`,`[${otherid},%`,`%,${otherid}]`,`[${otherid}]`,`%,${ownerid},%`,`[${ownerid},%`,`%,${ownerid}]`,`[${ownerid}]`],(err, users)=>{
        if (err) throw err;
      //  console.log(users)
      console.log("i am going to leaving here",users)
       if(users[0].length > 0 ){
        console.log("i am going not to leaving here")
        res.json({status:"success",users:users[0],commongroups:users[1]})
       }else{
        console.log("i aalready left here")
        conn.query(`select * from users where userid=? ; 
        select * from chatgroups where (members like ? or members like ? or members like ? or members like ?) 
        AND (members like ? or members like ? or members like ? or members like ? )`,
        [otherid,`%,${otherid},%`,`[${otherid},%`,`%,${otherid}]`,`[${otherid}]`,`%,${ownerid},%`,`[${ownerid},%`,`%,${ownerid}]`,`[${ownerid}]`],(err, justuser)=>{
            if (err) throw err;
            if(justuser.length > 0){
            res.json({status:"success",users:justuser[0], commongroups:justuser[1]})
            }else{
                res.json({status:"failed", reason:"could not find user"})
            }
        })
       }
    })
}
})
app.get("/fetch-unread/messages",(req, res) =>{
    conn.query("select COUNT (*) AS messageee from (select * from messages where reciever="+1+" and status =? group by sender) as mess  ",["delivered"],(err, unreadmessages)=>{
        if(err) throw err;
        res.send(unreadmessages[0])
    })
})
app.get("/user/login",loginMail, (req,res)=>{
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
app.get("/accept-pendingrequests", (req, res)=>{
    let id = req.query.id
    id = JSON.parse(id)
  const d = new Date()
  conn.query(`delete from pendingconnections where conn1=? and conn2 =?`,[id.otheruserid,parseInt(id.mainuserid)],
  (err, deleted)=>{
    if (err) throw err;
    if (deleted){
        conn.query(`insert into connections (conn1,conn2, conndate, conntime) values (?,?,?,?)`,
        [id.otheruserid,parseInt(id.mainuserid),d.getTime(),d.getTime()],(err, inserted)=>{
          if (err) throw err;
          if(inserted){    
          //  const typee = getCurrentUser(parseInt(id.otheruserid))
          //  socket.broadcast.to(typee.socketId).emit("connection added to your connections")    
           res.json({message:"connection added", status:"success"})
              }
      })
    }
  })
})
app.get("/connect-user", (req, res)=>{
    let id = req.query.id
    id = JSON.parse(id) 
  const d = new Date()
  conn.query(`select * from connections where (conn1 =? and conn2 = ?) OR (conn1=? and conn2=?)`,
  [id.otheruserid,parseInt(id.mainuserid),parseInt(id.mainuserid),id.otheruserid],(err, connected)=>{
    if (err) throw err;
    if(connected && connected.length > 0){
       conn.query(`delete from connections where (conn1 =? and conn2 = ?) OR (conn1=? and conn2=?)`,
       [id.otheruserid,parseInt(id.mainuserid),parseInt(id.mainuserid),id.otheruserid],(err2, deleted)=>{
        if(err2) throw err2;
        console.log("connection removed")
        if(deleted){
     res.json({message:"connection removed", status:"success"})
        }
    })
    }else{
        conn.query("select * from connections where (conn1 =? and conn2 = ?) OR (conn1=? and conn2=?)",
        [id.otheruserid,parseInt(id.mainuserid),parseInt(id.mainuserid),id.otheruserid],(err, connected)=>{
            if (err) throw err;
            if (connected && connected.length > 0){
                res.json({message:"connection request already exist", status:"failed"})
            }
            else{
     conn.query("insert into pendingconnections (conn1,conn2, connstatus, date) values (?,?,?,?)",
     [parseInt(id.mainuserid),id.otheruserid,"pending",d.getTime()], (error, inserted)=>{
        if (error) throw error;
        console.log("connection request sent")
        if(inserted){
        res.json({message:"connection request sent", status:"success"})
        }
     })
    }
    })
    }
  })  
})
app.get("/remove-request", (req,res)=>{
    let id = req.query.id
    id = JSON.parse(id)
  const d = new Date()
  conn.query(`delete from pendingconnections where (conn1 =? and conn2 = ?)`,
  [parseInt(id.mainuserid),id.otheruserid],(err, deleted)=>{
   if(err) throw err;
   console.log("pendingconnection removed")
   if(deleted){
res.json({message:"pendingconnection removed", status:"success"})
   }
})
})
app.get("/like-post",(req, res)=>{
    console.log(req.query.id, req.query.uploadid)
    conn.query("select likes from uploads where uploadid =?",[req.query.uploadid],(err, likes)=>{
        if (err) throw err;
     if(likes){
     let prevlikes =  JSON.parse(likes[0].likes)
        if(prevlikes.includes(req.query.id) || prevlikes.includes(parseInt(req.query.id))){
         prevlikes = prevlikes.filter(prev => prev != (req.query.id))
         console.log("its included", prevlikes)
         conn.query("update uploads set likes = ? where uploadid =?",[JSON.stringify(prevlikes), req.query.uploadid],(err, updated)=>{
            if (err) throw err;
            if(updated){
                res.json({status:"success",likes:prevlikes})
            }
         })
        }else{
        prevlikes = [...prevlikes, parseInt(req.query.id)]
       // prevlikes.push(parseInt(req.query.id))
         console.log("its not included", prevlikes)
         conn.query("update uploads set likes = ? where uploadid =?",[JSON.stringify(prevlikes), req.query.uploadid],(err, updated)=>{
            if (err) throw err;
            if(updated){
                res.json({status:"success", likes:prevlikes})
            }
         })
        }
     }
    })
})


app.get("/fetch-uploads", (req,res)=>{
    conn.query(`select * from uploads inner join users on users.userid=uploads.userid, (SELECT COUNT(*) FROM comments where uploadid=15) AS commentCount  order by time desc`, (err, uploads)=>{
        if (err) throw err;
        res.send(uploads)
    })
})
app.get("/upload-comment",(req, res)=>{
    if(req.query.mainuser){
    conn.query("insert into comments (userid,uploadid,comment,likes, date,time) values (?,?,?,?,?,?)",
    [req.query.mainuser,req.query.uploadid,req.query.comment,"[]","[]",Date.now(),Date.now()]
    ,(err, inserted)=>{
        if (err) throw err;//select * from comments inner join users on users.userid = comments.userid where comments.uploadid = ?
 conn.query("select * from comments inner join users on users.userid=comments.userid where comments.uploadid = ? order by comments.commentid desc",[req.query.uploadid],(err, comments)=>{
if (err) throw err;
        if (inserted){
            console.log(inserted, "added successfully")
            res.json({status:"success",comments:comments})
        }
    })
})
    }else{
        res.json({status:"failed"})
    }
})
app.get("/view-upload", (req,res)=>{
    conn.query(`select * from uploads inner join users on users.userid=uploads.userid, (SELECT COUNT(*) AS memberCount FROM comments where uploadid= ${req.query.uploadid}) AS meme  where uploads.uploadid= ${req.query.uploadid}`, (err, upload)=>{
        if (err) throw err;
        console.log(upload)
        conn.query(`select * from comments inner join users on users.userid = comments.userid where comments.uploadid = ? order by comments.commentid desc`,
        [req.query.uploadid],(err, comments)=>{
            if (err) throw err;
           res.json({status:"success",post:upload[0],comments:comments})  
        })       
    })
})
app.post("/upload-post",uploads.array("files"),async (req,res)=>{
    const uploader = async path => 
     new Promise(resolve => {
     cloudinary.uploader.upload(path, (result) => {
        resolve({
            url: result.url,
            id: result.public_id
        })
    }, {
        resource_type: "auto",
        folder: "/chatapp/uploads"
    })
})
    const mainImages =[]
    const urls = []
    const files = req.files || req.file
    for(var i=0; i < files.length; i++){
        const {path} = files[i]
        console.log(files[i])
        const newPath = await uploader(path)
        urls.push(newPath)   
        fs.unlinkSync(path)
        mainImages.push(files[i].filename)
        } 
        const body = req.body
        console.log(body)
        console.log(JSON.stringify(mainImages)) 
    const d = new Date()
    conn.query(`insert into uploads (userid, imgs,caption,likes, dislikes,date, time) values (?,?,?,?,?,?,?)`,[body.id, JSON.stringify(mainImages),body.caption,"[]","[]",d.getTime(),d.getTime()],(err, inserted)=>{
        if (err) throw err;
        if (inserted){
            console.log("upload done")
            res.json({status:"success", message:"uploaded successfully"})
        }else{
            console.log("couldnt upload")
            res.json({status:"failed", message:"uploaded failed, an error occured"})
        }
    })
})
app.get("/confirm_email", (req,res)=>{
    conn.query("select * from users where email =? and confirmed = ?", [req.query.email,"false"],(err, user)=>{
        if (err) throw err;
        if (user && user.length > 0 && user[0].confirmationId === req.query.confirmationId){
            conn.query("update users set confirmed = ? where email = ?",["true", req.query.email], (err, update)=>{
                if (err) throw err;
                const options ={
                    from:`"Email Confirmation Message" <yexies4ogb@gmail.com>`,
                    to:req.query.email,
                    subject:"Email Confirmed Successfully!",
                    html:`Hi <b>${req.query.email}</b><br/><br/><br/><br/>,
                   <div>
                   <center>
                   <p> Your Account has been confirmed successfully and you now have full access to our chat applications 
                   and eccommercial platform to buy and sell ...</p>
                   </center>
                   </div>`
                }
                transporter.sendMail(options, (err, info)=>{
                    if (err) throw err;

                })
                 res.json({status:"success"})
            })         
        }else{
            res.json({status:"failed"})
        }
    })
   
})
app.post("/user/register",uploads.single("files"), (req,res)=>{
    const body = JSON.parse(req.body.inputs)
    const confirmationId = Math.floor(Math.random()*1000000)
    console.log(confirmationId, "confirmationId")
    const d = new Date()
    conn.query("select * from users where email =? ",[body.email],(err, user)=>{
        if (err) throw err;
        if(user && user.length > 0){
            console.log("email is taken")
            res.json({status:"failed", message:"This Email is not available"})
        }else{
            //kingtunlab
    if(req.file){  
        cloudinary.v2.uploader.upload(
            req.file.path,
            {
                folder:"chatapp/profilepicture"
            },
            (error, result)=>{
                if (error) throw error;
                const image = `${result.original_filename}.${result.original_extension}`
                conn.query(`insert into users (name,username, email, gender,image, contact, password,following,followers,lastseen,reg_month, reg_date) values (?,?,?,?,?,?,?,'[]','[]',${d.getTime()},${d.getMonth()+1},${d.getDate()})`,[body.name,body.username,body.email,body.gender,image,body.contact,body.password],(err, file)=>{
                    if(err){ 
                        console.log(err)
                        res.json({status:"failed"})
                    }else if(!file){
                      res.json({status:"failed"})
                  }
                  })
            }
        )
    }else{
    conn.query(`insert into users (name,username,confirmationId,confirmed,reg_time, email, gender, contact, password,following, followers,lastseen,reg_month, reg_date) values (?,?,?,?,?,?,?,?,?,'[]','[]',${d.getTime()},${d.getMonth()+1},${d.getDate()})`,[body.name,body.username,confirmationId,"false",d.getTime(),body.email,body.gender,body.contact,body.password],(err, file)=>{
      if(err){ 
          res.json({status:"failed"})
      }else if(!file){
        res.json({status:"failed"})
    }

    })
}
let mailOptions ={
    from:'"Hormel Chat!" <yexies4ogb@gmail.com>',
    to:body.email,
    subject:`Action Required! Please Confirm Your Email Address`,
    html: `Hi <b>${body.name},</b><br/><br/> Please Confirm ${body.email} by clicking the button below...Thank You and Happy Connection! <br/><br/>
    <center><a href="/${body.email}/confirm_emailAddr/${Math.floor(Math.random*1000000000)}jkdjdbn-${Math.floor(Math.random*1000000000)}odfkdmnd-${Math.floor(Math.random*100000)}dbdnd-${confirmationId}thsfghc-${Math.floor(Math.random*100000)}rjdyuhf"><button style="background-color:blue;color:white;padding:2px 10px;outline:none;border:none;border-radius:3px">Confirm</button></a></center><br/><br/>
    <span>Having Trouble clicking the button or accessing the route kindly copy and paste the route below to your browser URL tab</span><br/><br/><br/>
    <center>
    <a href="http://localhost:3000/${body.email}/confirm_emailAddr/${Math.floor(Math.random*1000000000)}jkdjdbn-${Math.floor(Math.random*1000000000)}odfkdmnd-${Math.floor(Math.random*100000)}dbdnd-${confirmationId}thsfghc-${Math.floor(Math.random*100000)}rjdyuhf">
    http://localhost:3000/${body.email}/confirm_emailAddr/${Math.floor(Math.random*1000000000)}jkdjdbn-${Math.floor(Math.random*1000000000)}odfkdmnd-${Math.floor(Math.random*100000)}dbdnd-${confirmationId}thsfghc-${Math.floor(Math.random*100000)}rjdyuhf
    </a>
    </center>
    <small style="color:grey">You Are receiving this mail because you recently registered to our chat platform</small><br/><br/><br/>
    <small style="color:red">If You didnt initiate this action kindly click on the cancel button to cancel this regsitration</small><br/>
    <button style="background-color:red;color:white;padding:2px 4px;border-radius:3px">cancel</button>`
  }
  transporter.sendMail(mailOptions, (err, info)=>{
    if (err) throw err;
    else{
      console.log("email sent to ", body.email)
      res.json({status:"success",data:body})
    }
  })
}
})
})
if(process.env.NODE_ENV === "production"){ 
    app.use(express.static("frontend/build"))
    
    app.get('*',(req,res)=>{
        res.sendFile(path.join(__dirname, 'frontend','build', 'index.html'));
    })
    }  
server.listen(process.env.PORT ||  5000, ()=>{
    console.log("port running on 5000 ogbonnaya")
})