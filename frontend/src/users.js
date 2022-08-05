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
     const {users, conns} = useContext(userContext)
     const [mainusers,setusers] = users
     const [mainconnects, setconnects] = conns


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
       let  conn = mainconnects 
       console.log("conn",conn)
       console.log("connection removed")
        mainconnects.splice(conn.indexOf(id),1)
        console.log("spliced conn",conn)
        setconnects(conn)
        }else  if(res.data.message === "connection added" && res.data.status ==="success"){
            let  conn = mainconnects 
            console.log("connection added")
            console.log("conn",conn)
             conn.unshift(id)
             console.log("unshifted conn",conn)
             setconnects(conn)
             }
    })
    .catch(err => console.log(err))
    }
}
useEffect(()=>{
    console.log("mainconnects",mainconnects)
},[mainconnects])
console.log("props.lastseen[1]",props.requestedconn,props.pendingconn)
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
                          <a href={`/chat/${connect.userid}`} style={{textDecoration:"none"}}>
                                <small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{connect.name}</small>  <small>{props.online.includes(connect.id) ? <span style={{color:"blue"}} className="fa fa-circle"></span> : ""}</small><br/>
                                <small className='text-muted' style={{fontSize:"12px",padding:"0",margin:"0"}}>@{connect.username}</small> <br/>
                                <small style={{color:"grey"}}>{props.online.includes(connect.id) ? null : props.lastseen[connect.id] ? formatlastSeen(props.lastseen[connect.id]) : formatlastSeen(connect.lastseen)}</small>
                               <small style={{display:"none"}}>{typingclients.includes(connect.id) ? <i style={{color:"green"}} >typing ...</i> : ""}</small>
                                </a>
                                  </div>
                            </div>
                            <div className="col-2">
                             {mainconnects.includes(connect.userid) ?
                            <button className={`btn  btn-sm btn-primary`} onClick={()=>connects(connect.userid)} style={{border:"1px solid blue"}}> disconnect  </button>

                            : props.pendingconn.includes(connect.userid) ?
                            <button className={`btn  btn-sm`} style={{border:"1px solid blue"}}>pending</button>

                            : props.requestedconn.includes(connect.userid) ?
                            <button className={`btn  btn-sm`} style={{border:"1px solid blue"}}>request sent </button>
                        
                         : <button className={`btn  btn-sm`} onClick={()=>connects(connect.userid)} style={{border:"1px solid blue"}}>connect </button>
                             }
                            </div>
                        </div>
                  
                        )}
              </div>
     );
}

export default (Users);