import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from "./socketconn"
import {useNavigate} from "react-router-dom"
import { formater, formatlastSeen } from './formatTime';
import axios from 'axios';
import Cookies from "js-cookie"
import { userContext } from './contextJs';
import { useContext } from 'react';

const CryptoJS = require("crypto-js")

function Users(props) {
    const [typingclients, settypingclients] = useState([])
    const [lastmessages,setlastmessages] = useState({})
     const {users, conns, pendingconn, requestedconn} = useContext(userContext)
     const [mainusers,setusers] = users
     const [mainconnects, setconnects] = conns
     const [mainpendingconn, setpendingconn]= pendingconn
     const [mainrequestedconn, setrequestedconn] = requestedconn


      let navigate = useNavigate()
        useEffect(()=>{
       socket.on("typers",(typers)=>{
  settypingclients(typers)
    })
    socket.on("recieving message", (data)=>{
        console.log(data)
        const sender= data.sender

//        setlastmessages(prev => ({...prev, [`${sender}/${reciever}`]:data}))
    })
    socket.on("sending message", (data)=>{
        console.log(data)
        const sender= data.sender

    //    setlastmessages(prev => ({...prev, [`${sender}/${reciever}`]:data}))
    })
})

const connects =(id)=>{
    if(Cookies.get("cvyx")){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
     let ids ={otheruserid:id, mainuserid:decryptedData}
     console.log(ids)
    axios.get(`https://realchatapps.herokuapp.com/connect-user?id=${JSON.stringify(ids)}`)
    .then(res => {
        if(res.data.message === "connection removed" && res.data.status ==="success"){
       console.log("connection removed")
      setconnects(mainconnects.filter(conn => conn !== id))
        }else  if(res.data.message === "connection request sent" && res.data.status ==="success"){
            let  conn = mainconnects 
            console.log("connection request sent")
             setpendingconn(prev => ([...prev, id]))
             }
    })
    .catch(err => console.log(err))
    }
}
const acceptconnect =(id)=>{
    if(Cookies.get("cvyx")){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
     let ids ={otheruserid:id, mainuserid:decryptedData}
     console.log(ids)
    axios.get(`https://realchatapps.herokuapp.com/accept-pendingrequests?id=${JSON.stringify(ids)}`)
    .then(res => {
         if(res.data.message === "connection added" && res.data.status ==="success"){
            setrequestedconn(mainrequestedconn.filter(reqconn => reqconn !== id))
            setconnects(prev => ([...prev, id]))
         }
    })
    .catch(err => console.log(err))
}
}
const removerequest=(id)=>{
    if(Cookies.get("cvyx")){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
     let ids ={otheruserid:id, mainuserid:decryptedData}
     console.log(ids)
    axios.get(`https://realchatapps.herokuapp.com/remove-request?id=${JSON.stringify(ids)}`)
    .then(res => {
         if(res.data.message === "pendingconnection removed" && res.data.status ==="success"){
           setpendingconn(mainpendingconn.filter(pendconn => pendconn !== id))
         }
    })
    .catch(err => console.log(err))
}
}
 useEffect(()=>{
    console.log(mainpendingconn)
 },[mainpendingconn])
return ( 
        <div className='container'>
            <div className='row' style={{marginTop:"80px"}}>
                <div className='col-12'>
                    <center><p style={{fontSize:"20px",color:"grey"}}><span className='fa fa-user-o'> </span>({mainusers.length})</p></center>
                </div>
            </div>
                      {mainusers.map(connect =>
                  
                        <div className='row'  key={connect.id} style={{padding:"5px",borderBottom:"0.4px solid lightgrey"}}>
                            <div className='col-3' style={{padding:"5px"}}>
                                <img style={{borderRadius:"50%",width:"100%",border:"2px solid lightgrey",padding:"1px"}} src={connect.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                            </div>
                            <div className='col-5' style={{position:"relative"}}>
                                <div style={{position:"absolute",left:"0",top:"10%",lineHeight:"1"}}>
                          <a href={`/chat/${connect.userid}?display=messages`} style={{textDecoration:"none"}}>
                                <small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{connect.name}</small>  <small>{props.online.includes(connect.id) ? <span style={{color:"blue"}} className="fa fa-circle"></span> : ""}</small><br/>
                                <small className='text-muted' style={{fontSize:"12px",padding:"0",margin:"0"}}>@{connect.username}</small> <br/>
                                <small style={{color:"grey"}}>{props.online.includes(connect.id) ? null : props.lastseen[connect.id] ? formatlastSeen(props.lastseen[connect.id]) : formatlastSeen(connect.lastseen)}</small>
                               <small style={{display:"none"}}>{typingclients.includes(connect.id) ? <i style={{color:"green"}} >typing ...</i> : ""}</small>
                                </a><br/>
                                {mainrequestedconn.includes(connect.userid) ?
                                <small style={{fontSize:"11px",color:"green"}}>* @{connect.username} has requested to connect with you</small>
                                : null }
                                   {mainpendingconn.includes(connect.userid) ?
                                <small style={{fontSize:"11px",color:"indianred"}}> your request has been sent</small>
                                : null }
                                  </div>
                            </div>
                            <div className="col-2">
                             {mainconnects.includes(connect.userid) ?
                            <button className={`btn  btn-sm btn-primary`} onClick={()=>connects(connect.userid)} style={{border:"1px solid blue"}}> disconnect  </button>

                            : mainpendingconn.includes(connect.userid) ?
                            <button className={`btn  btn-sm`} style={{border:"1px solid blue"}} onClick={()=> removerequest(connect.userid)}>request sent</button>

                            : mainrequestedconn.includes(connect.userid) ?
                           <div>
                             <button className={`btn  btn-sm`} style={{border:"1px solid blue"}} onClick={()=>acceptconnect(connect.userid)}>accept request </button><br/>
                            </div>
                         : <button className={`btn  btn-sm`} onClick={()=>connects(connect.userid)} style={{border:"1px solid blue"}}>connect </button>
                             }
                            </div>
                        </div>
                  
                        )}
              </div>
     );
}

export default (Users);