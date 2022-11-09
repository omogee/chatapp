import React, { useState, useEffect } from 'react';
import Connection from './connection';
import Groupinbox from './groupinbox';
import {Navigate} from "react-router-dom"
import Cookies from "js-cookie"

const CryptoJS = require("crypto-js")

function ChatGroup(props) {
    const [redirect, setredirect] = useState(false)

    useEffect(()=>{
        if(Cookies.get("cvyx")){
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          if(!decryptedData || decryptedData === null){
           setredirect(true)
          }
        }else{
            setredirect(true)
        }
    })
   
    if(redirect){
        return(
            < Navigate to="/login"></Navigate>
            )
    }else{
    return ( 
        <div className='container'>
        <div className='row' style={{position:"fixed",width:"100%",padding:"0",margin:"0",left:"0"}}>
            <div  className='d-none d-md-block col-md-4' style={{height:"100vh",overflow:"auto",boxSizing:"border-box"}}>
                <Connection conn={props.users} user={props.user} typingclients={props.typingclients} online={props.online} />
            </div>
            <div className='col-12 col-md-8' style={{height:"100vh",border:"1px solid lightgrey",overflow:"auto",adding:"0",margin:"0",padding:"0",width:"100%"}} >
            <Groupinbox groupmessages={props.groupmessages} user={props.user} online={props.online} connects={props.connects} lastseen={props.lastseen}/>
            </div>
        </div>
    </div>
     );
}
}

export default ChatGroup;