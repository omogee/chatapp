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

const CryptoJS = require("crypto-js")

function App() {
  const [users, setusers]=useState([])
  const [connections,setconnections] = useState([])
  const [pendingconn,setpendingconn] = useState([])
  const [requestedconn,setrequestedconn] = useState([])
  const [connects, setconnects] =useState([])
  const [online, setOnline]= useState([])
  const [typingclients, settypingclients]= useState([])
  const [lastseen, setlastseen] = useState({})
  const [pageurl, setpageurl] = useState("")  

  useEffect(()=>{
    if(Cookies.get("cvyx")){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
   socket.connect() 

    axios.get(`https://realchatapps.herokuapp.com/fetch-users?id=${decryptedData}`)
    .then(res => setusers(res.data))
    .catch(err => console.warn(err))
    
    axios.get(`https://realchatapps.herokuapp.com/fetch-pendingconnections?requestid=${decryptedData}`)
    .then(res => {
      setrequestedconn(res.data.requestedconn)
      setpendingconn(res.data.pendingconn)
    })
    .catch(err => console.warn(err))

     axios.get(`https://realchatapps.herokuapp.com/fetch-connections?id=${decryptedData}`)
    .then(res => setconnections(res.data))
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
  }, 2000)
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
  let connect =[]
let requested=[]
let pending =[]
  if(Cookies.get("cvyx")){
   var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  requestedconn.map(conn =>{
    console.log("conn2",conn.conn2)
    requested.push(parseInt(conn.conn2))
   })
   pendingconn.map(conn =>{
    pending.push(parseInt(conn.conn1))
   })
 setpendingconn(pending)
 setrequestedconn(requested)
   
  connections.map(conn =>{
     connect.push(conn.userid)
  })
  setconnects(connect)
  }
},[connections])
useEffect(()=>{
  setpageurl(window.location.pathname)
},[])
  return (
    <Router>
      { pageurl.indexOf("chat") > -1 || pageurl.indexOf("connections") > -1 
      ?
      null
      : <Navbar />
    }
      <Routes>
        <Route exact path="/" element={<Home connects={connects} pendingconn={pendingconn} requestedconn={requestedconn} lastseen={lastseen} userslength={users.length} online={online} users={users}/>} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route  path="/chat/:userId" element={ <ChatApp users={connections} lastseen={lastseen} online={online} typingclients={typingclients}/>} />
        <Route  path="/connections/:userId" element={/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? <Connection conn={connections} lastseen={lastseen} online={online} typingclients={typingclients}/> : null} />
        <Route exact path="/profile/:userId" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
