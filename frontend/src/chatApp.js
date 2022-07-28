import React, { useState, useEffect } from 'react';
import Connection from './connection';
import Inbox from './inbox';
import axios from "axios"
import Cookies from "js-cookie"
import Login from "./login"
import {useParams} from "react-router-dom"
const CryptoJS = require("crypto-js")

function ChatApp(props) {
    const [user,setuser] = useState({})
    const [users, setusers] = useState([ ])
    const [redirect,setredirect] =useState(false)
    const querystring = new URLSearchParams(window.location.search)
    const params = useParams()
  useEffect(()=>{
      if(!Cookies.get("cvyx") || !params.userId || params.userId === null){
      setredirect(true)
      }else{
          
      }
  })
      useEffect(()=>{
    if(Cookies.get("cvyx") && params.userId && params.userId !== null){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  
   axios.get(`https://realchatapps.herokuapp.com/fetch-user?inboxuserId=${params.userId}&&mainuserId=${decryptedData}`)
   .then(res => {
       if(res.data.length === 0 || !res.data){
      setredirect(true)
       }else{
           setuser(res.data[0])
       }
   })
   .catch(err => console.warn(err))
    }
    },[params])
   
    if(redirect){
        return <Login previouspage={window.location.pathname + window.location.search}/>
    }else{
    return (  
        <div className='container'>
            <div className='row' style={{position:"fixed",width:"100%",padding:"0",margin:"0",left:"0"}}>
                <div  className='d-none d-md-block col-md-4' style={{height:"100vh",overflow:"auto",boxSizing:"border-box"}}>
                    <Connection conn={props.users} typingclients={props.typingclients} online={props.online} />
                </div>
                <div className='col-12 col-md-8' style={{height:"100vh",border:"1px solid lightgrey",overflow:"auto",adding:"0",margin:"0",padding:"0",width:"100%"}} >
                <Inbox  online={props.online} lastseen={props.lastseen} user={user}/>
                </div>
            </div>
        </div>
    );
    }
}

export default ChatApp;
/**
 * {id:1,name:"Eze OLuchukwu",username:"olugod",gender:"male", contact:"08091421003",email:"olu@gmail.com"},
        {id:2,name:"Eze Ogbonnaya",username:"otosh",gender:"male", contact:"08169319476",email:"yexies4ogb@gmail.com"},
        {id:3,name:"Eze Ezinne",username:"jesusbaby",gender:"female", contact:"08038527159",email:"ezinne@gmail.com"},
        {id:4,name:"Eze Simon",gender:"male",username:"yungprinx", contact:"08167209476",email:"simon@gmail.com"},
        {id:5,name:"Eze Ifeoma",gender:"female", username:"ifexy",contact:"08066828626",email:"ifeoma@gmail.com"},
        {id:6,name:"Eze Emeka",gender:"male", username:"funex",contact:"08068179583",email:"funex@gmail.com"},
        {id:7,name:"Eze Esther",gender:"female",username:"esteem", contact:"08169319476",email:"esteem@gmail.com"},
        {id:8,name:"Eze Ike",gender:"male",username:"dela", contact:"08169319476",email:"dela@gmail.com"},
        {id:9,name:"Ada Ig",gender:"female",username:"adabeke",contact:"08125689229",email:"ada@gmail.com"},
        {id:10,name:"Uchechi Nwagu",gender:"female",username:"africana",contact:"08100912881",email:"afrikana@gmail.com"},
        {id:11,name:"Emmanuel Amucha",gender:"male",username:"chegzy", contact:"08149792283",email:"chegzy@gmail.com"},
        {id:12,name:"Jamal Adeniyi",gender:"male",username:"araka", contact:"08062738496",email:"araka@gmail.com"},
        {id:13,name:"David Udoh",gender:"male",username:"hazard",contact:"07085027448ß",email:"hazard@gmail.com"},
        {id:14,name:"Ella Lapo",gender:"female",username:"ella", contact:"09063484270",email:"ella@gmail.com"},
 */