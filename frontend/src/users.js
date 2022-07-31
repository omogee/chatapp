import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from "./socketconn"
import {useNavigate} from "react-router-dom"
import { formater, formatlastSeen } from './formatTime';

function Users(props) {
    const [typingclients, settypingclients] = useState([])
    const [lastmessages,setlastmessages] = useState({})
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
console.log("props.lastseen[1]",props.requestedconn,props.pendingconn)
    return ( 
        <div className='container-fluid'>
            <div className='row' >
              <div className='col-12' style={{padding:"10px"}}>
                  <div style={{width:"100%"}}>
                      {props.users.map(connect =>
                     <a href={`/chat/${connect.userid}`}>
                        <div className='row'  key={connect.id} style={{padding:"5px",borderBottom:"0.4px solid lightgrey"}}>
                            <div className='col-3' style={{padding:"5px"}}>
                                <img style={{borderRadius:"50%",width:"100%",border:"2px solid lightgrey",padding:"1px"}} src={connect.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                            </div>
                            <div className='col-6' style={{position:"relative"}}>
                                <div style={{position:"absolute",left:"0",top:"10%",lineHeight:"1"}}>
                                <small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{connect.name}</small>  <small>{props.online.includes(connect.id) ? <span style={{color:"blue"}} className="fa fa-circle"></span> : ""}</small><br/>
                                <small className='text-muted' style={{fontSize:"12px",padding:"0",margin:"0"}}>@{connect.username}</small> <br/>
                                <small style={{color:"grey"}}>{props.online.includes(connect.id) ? null : props.lastseen[connect.id] ? formatlastSeen(props.lastseen[connect.id]) : formatlastSeen(connect.lastseen)}</small>
                               <small style={{display:"none"}}>{typingclients.includes(connect.id) ? <i style={{color:"green"}} >typing ...</i> : ""}</small>
                                </div>
                            </div>
                            <div className="col-2">
                            <button className={`btn  btn-sm ${props.connects.includes(connect.userid) ? "btn-primary" : null}`} style={{border:"1px solid blue"}}>{props.connects.includes(connect.userid) ? "disconnect" : 
                            props.pendingconn.includes(connect.userid) ? "pending" :
                            props.requestedconn.includes(connect.userid) ? "request sent" :  "connect"}</button>
                            </div>
                        </div>
                      </a>
                        )}
                  </div>
              </div>
            </div>
        </div>
     );
}

export default (Users);