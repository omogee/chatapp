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
  const [value, setvalue] = useState("i am the context value man, its better in states")

  useEffect(()=>{
    if(Cookies.get("cvyx")){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
   socket.connect() 

    axios.get(`https://realchatapps.herokuapp.com/fetch-users?id=${decryptedData}`)
    .then(res => setusers(res.data))
    .catch(err => console.warn(err))

    axios.get(`https://realchatapps.herokuapp.com/fetch-user?id=${decryptedData}`)
    .then(res => setusers(res.data.user))
    .catch(err => console.log(err))
    /*
    axios.get(`https://realchatapps.herokuapp.com/fetch-pendingconnections?requestid=${decryptedData}`)
    .then(res => {
      console.log("res.data", res.data.requestedconn, res.data.pendingconn)
      setrequestedconn(res.data.requestedconn)
      setpendingconn(res.data.pendingconn)
    })
    .catch(err => console.warn(err))
*/
     axios.get(`https://realchatapps.herokuapp.com/fetch-connections?id=${decryptedData}`)
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
    console.log("connectedusers",connectedusers)
    setOnline(connectedusers)
})

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
console.log("user",user)
  return (
    <Router>
      { pageurl.indexOf("chat") > -1 || pageurl.indexOf("connections") > -1 
      ?
      null
      : <Navbar />
    }
    <userContext.Provider value={{users:[users, setusers],user:[user,setuser], conns:[connects, setconnects], pendingconn:[pendingconn,setpendingconn], requestedconn:[requestedconn, setrequestedconn]}}>
      <Routes>  
       <Route exact path="/" element={<Home connects={connects} pendingconn={pendingconn} requestedconn={requestedconn} lastseen={lastseen} userslength={users ? users.length: null} online={online} users={users}/>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/user" element={<Users users={users} pendingconn={pendingconn} requestedconn={requestedconn} lastseen={lastseen} connects={connects} online={online}/>} />
        <Route  path="/chat/:userId" element={ <ChatApp users={connections} connects={connects} lastseen={lastseen} online={online} typingclients={typingclients}/>} />
        <Route  path="/inbox/:userId" element={ <Inbox users={connections} lastseen={lastseen} online={online} typingclients={typingclients}/>} />
        <Route  path="/connections/:userId" element={/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? <Connection conn={connections} lastseen={lastseen} online={online} typingclients={typingclients}/> : null} />
        <Route exact path="/profile/:userId" element={<Profile />} /> 
        <Route exact path="/uploads" element={<Uploads />} />
        <Route exact path="/view-upload/:uploadid" element={<ViewUpload />} />
      </Routes>
         </userContext.Provider>
    </Router>
  );
}

export default App;
