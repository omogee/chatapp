import React, { useState, useEffect } from 'react';
import axios from "axios"

import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Home from './home';
import Login from './login';
import Register from './register';
import Navbar from './navbar';
import Connection from './connection';
import ChatApp from './chatApp';
import socket from "./socketconn"
import Cookies from "js-cookie"
import Profile from './profile';
import { userContext, connectContext } from './contextJs';
import Users from './users';
import Inbox from './inbox';
import Uploads from './upload';
import ViewUpload from './viewupload';
import Groupinbox from './groupinbox';
import ChatGroup from './chatgroup';
import Groups from './groups';
import GroupProfile from './groupprofile';
import ConfirmEmail from './confirmemail';

const CryptoJS = require("crypto-js")

function App() {
  const [users, setusers]=useState([])
  const [user, setuser] =useState({})
  const [connections,setconnections] = useState([])
  const [pendingconn,setpendingconn] = useState([])
  const [requestedconn,setrequestedconn] = useState([])
  const [connects, setconnects] =useState([])
  const [online, setOnline]= useState([])
  const [typingclients, settypingclients]= useState([])
  const [lastseen, setlastseen] = useState({})
  const [pageurl, setpageurl] = useState("")  
  const [noOfUnreadMessages, setnoOfUnreadMessages] = useState(0)
  const [groupmessages, setgroupmessages] = useState({})
  const [lastunreadindex, setlastunreadindex] = useState('')
  const [value, setvalue] = useState("i am the context value man, its better in states")

  useEffect(()=>{
    if(Cookies.get("cvyx")){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
   socket.connect() 

    axios.get(`http://localhost:5000/fetch-users?id=${decryptedData}`)
    .then(res =>{ setusers(res.data)})
    .catch(err => {
      if(err && err.response.status === "401"){
        console.log("status is returning 401")
      }else{
        console.log("status is okay")
      }
    })

    axios.get(`http://localhost:5000/fetch-justuser?id=${decryptedData}`)
    .then(res => {
      setuser(res.data.user)
      setnoOfUnreadMessages(res.data.noOfUnreadMessages)
      setlastunreadindex(res.data.lastunreadindex)
    })
    .catch(err => console.log(err))
    /*
    axios.get(`http://localhost:5000/fetch-pendingconnections?requestid=${decryptedData}`)
    .then(res => {
      console.log("res.data", res.data.requestedconn, res.data.pendingconn)
      setrequestedconn(res.data.requestedconn)
      setpendingconn(res.data.pendingconn)
    })
    .catch(err => console.warn(err))
*/
     axios.get(`http://localhost:5000/fetch-connections?id=${decryptedData}`)
    .then(res => {
      setrequestedconn(res.data.requestedconn)
      setpendingconn(res.data.pendingconn)
      setconnections(res.data.connections)
    })
    .catch(err => console.warn(err))
    }
},[])

useEffect(()=>{
  socket.on("online users", connectedusers =>{
    setOnline(connectedusers)
},[])

socket.on("incomingmessage",(typer)=>{
     console.log("typingclients",typer)
  let prevTypers = typingclients;
  if(!prevTypers.includes(parseInt(typer))){
     console.log("typingclients after setting",prevTypers)
  prevTypers.push(parseInt(typer))
     console.log("typingclients after pushing",prevTypers)
  settypingclients(prevTypers)
  }
})
/**if(!groupmessages[`${data.room}`]){
   
    groupmessages[`${data.room}`] = [data]
    console.log("i am here also", groupmessages)
    setgroupmessages(groupmessages)
    console.log("i am here also also", groupmessages)
  }
  else if(groupmessages[`${data.room}`] && !groupmessages[`${data.room}`].includes(data)){
    groupmessages[`${data.room}`].push(data)
    setgroupmessages(groupmessages)
  } */
socket.on("room_message_delivery", data=>{
console.log("i am here")
let gpmessages = groupmessages;
  if(!gpmessages[`${data.room}`]){
    gpmessages[`${data.room}`] = [data]
  }
  else if(gpmessages[`${data.room}`] && !gpmessages[`${data.room}`].includes(data)){
    gpmessages[`${data.room}`].push(data)
  }
  setgroupmessages(gpmessages)
})
socket.on("lastseen", data=>{
  let d = new Date()
  console.log("lastseen")
  console.log("d", d.getTime())
  let userId = data.userId
  if(lastseen === {}){
    setlastseen({userId:d.getTime()})
  }else{
   setlastseen(prev => ({...prev,[`${data.userId}`]:d.getTime()}))
  }
})
socket.on("recieving message", data =>{
  const d = new Date()
  const text={
    sender:data.sender,
    reciever:data.reciever,
    message:data.message,
    connid:data.connid,
    time:d.getTime()
  }
  //setAllmessages(prev => [...prev, text])
 // allmessages[`conn${data.connid}`] ? setAllmessages(prev => ({...prev, [`conn${data.connid}`]:[...allmessages[`conn${data.connid}`],text]})) : setAllmessages(prev => ({...prev, [`conn${data.connid}`]:[text]}))

})
socket.on("disconnected",()=>{
  setTimeout(()=>{
    socket.connect()
  }, 100000)
})
})
useEffect(()=>{
  socket.on("ping",()=>{
    setInterval(() => {
      console.log("ping")
    }, 20000);
  })
},[])
useEffect(()=>{
  let pending =[]
  pendingconn.forEach(conn =>{
    console.log("pending......", conn.conn2)
    pending.push(parseInt(conn.conn2))
   })
   setpendingconn(pending)
},[connections])
useEffect(()=>{
  let connect =[]
let requested=[]

  if(Cookies.get("cvyx")){
   var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  requestedconn.forEach(conn =>{
    console.log("conn1", conn.conn1)
    requested.push(parseInt(conn.conn1))
   }) 
  
  connections.forEach(conn =>{
     connect.push(conn.userid)
  })
  console.log("requested", requested)
  setconnects(connect)
 
  setrequestedconn(requested)
  }
},[connections])

useEffect(()=>{
  setpageurl(window.location.pathname)
},[])
console.log("justuser", user)
  return (
    <Router>
      { pageurl.indexOf("chat") > -1 || pageurl.indexOf("inbox") > -1 || pageurl.indexOf("connections") > -1 || pageurl.indexOf("group") > -1 
      ?
      null
      : <Navbar user={user} lastunreadindex={lastunreadindex} pendingconn={pendingconn}  requestedconn={requestedconn} noOfUnreadMessages={noOfUnreadMessages}/>
    }
    <userContext.Provider value={{users:[users, setusers],gpmess:[groupmessages,setgroupmessages],user:[user,setuser], conns:[connects, setconnects], pendingconn:[pendingconn,setpendingconn], requestedconn:[requestedconn, setrequestedconn]}}>
      <Routes>  
       <Route exact path="/" element={<Home connects={connects} pendingconn={pendingconn} requestedconn={requestedconn} lastseen={lastseen} userslength={users ? users.length: null} online={online} users={users}/>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/:email/confirm_emailAddr/:confirmationId" element={<ConfirmEmail/>} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/users" element={<Users users={users} pendingconn={pendingconn} requestedconn={requestedconn} lastseen={lastseen} connects={connects} online={online}/>} />
        <Route  path="/chat/:userId" element={ <ChatApp users={connections} connects={connects} lastseen={lastseen} online={online} typingclients={typingclients}/>} />
        <Route  path="/inbox/:userId" element={ <Inbox users={connections} connects={connects} lastseen={lastseen} online={online} typingclients={typingclients}/>} />
        <Route  path="/connections/:userId" element={<Connection conn={connections} lastseen={lastseen} online={online} typingclients={typingclients}/> } />
        <Route exact path="/profile/:userId" element={<Profile  online={online} mainuser={user}/>} /> 
        <Route exact path="/profile/group/:groupId" element={<GroupProfile online={online}/>} />
        <Route exact path="/uploads" element={<Uploads />} />
        <Route exact path="/groups" element={<Groups />} />
        <Route exact path="/group/:groupid" element={<Groupinbox groupmessages={groupmessages} user={user}/>} />
        <Route  path="/chat/group/:groupid" element={ <ChatGroup groupmessages={groupmessages} user={user} users={connections} connects={connects} lastseen={lastseen} online={online} typingclients={typingclients}/>} />
        <Route exact path="/view-upload/:uploadid" element={<ViewUpload  user={user}/>} />
      </Routes>
         </userContext.Provider>
    </Router>
  );
}
//<Route  path="/connections/:userId" element={!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? <Connection conn={connections} lastseen={lastseen} online={online} typingclients={typingclients}/> : null} />

export default App;
