import React, { useState, useEffect ,useRef} from 'react';
import socket from "./socketconn"
import Cookies from "js-cookie"
import axios from "axios"
import Login from "./login"
import {useParams} from "react-router-dom"
import { formater, formatlastSeen, getSentTime } from './formatTime';
 import "./main.css"
 import "./index.css"
const CryptoJS = require("crypto-js")



function Inbox(props) {
  //  const { id, setid } = useState(props.match.params.userId);
    const [typingclients, settypingclients] = useState([])
    const [inboxlinks, setinboxlinks] = useState([{url:"",fa:"user",name:"view profile"},{url:"voice call",fa:"phone",name:"voice call"},{url:"video call",fa:"phone-plus",name:"video call"},{url:"create group",fa:"users",name:"create group"},{url:"settings",fa:"cog",name: "settings"},{url:"mute contact",fa:"ban",name:"mute"},{url:"block contact",fa:"trash",name:"block"}])
    const [displayheight,setdisplayheight] =useState("0px")
    const [message, setmessage] = useState("")
    const [allmessages, setAllmessages] =useState([])
    const querystring = new URLSearchParams(window.location.search)
    const [user,setuser] = useState({})
    const [userId, setuserId] = useState(querystring.get("userId"))
    const [ownerid, setownerid] = useState("")
   const isFirstRender = useRef(true)
   const refmessage= useRef(null)
   const hiddenref = useRef(null)
   const inputref=useRef(null)
   const fileinput = useRef(null)
   const params = useParams()
   
useEffect(()=>{
  if(Cookies.get("cvyx") && params.userId && params.userId !== null){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  setownerid(decryptedData)
  setuserId(params.userId)
  axios.get(`https://realchatapps.herokuapp.com//fetch-messages?conn1=${decryptedData}&conn2=${params.userId}`)
  .then(res => setAllmessages(res.data))
  .catch(err => console.warn(err))
}
 hiddenref.current.scrollIntoView({behavior:"smooth"})
},[params])
useEffect(()=>{
  refmessage.current.scrollTop =  refmessage.current.scrollHeight;
  hiddenref.current.scrollIntoView({behavior:"smooth"})
},[allmessages])
 const scrollToTop =()=>{
  //  alert("re-arranging")
   refmessage.scrollTop =  refmessage.scrollHeight;
//  this.dummyDiv.scrollIntoView({behavior:"smooth"})
  }
    const change=(e)=>{     
   setmessage(e.target.value)
  if(Cookies.get("cvyx") && params.userId && params.userId !== null){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
   socket.emit("typing", {typingclient:decryptedData, recievingclient:params.userId })
}
    }
 useEffect(()=>{
   window.addEventListener("keyup",()=>{
     inputref.current.focus()
   })
   const data ={
     sender: userId,
     reciever: ownerid,
     connId : props.user.connid
   }
   socket.emit("set all messages to read",data)
   socket.on("set messages to read", data=>{
     allmessages.map(message =>{
       message.status = "seen"
     })
   })
 })
 useEffect(()=>{
  if(props.online.includes(parseInt(userId))){
    allmessages.map(message =>{
      if(message.status === "sent"){
        message.status = "delivered"
      }
    })
  }
 },[props.online])
     useEffect(()=>{
         if (isFirstRender.current) {
    isFirstRender.current = false // toggle flag after first render/mounting
    return;
  }
      if(message.length === 0){
          if(Cookies.get("cvyx") && params.userId && params.userId !== null){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
   socket.emit("untyping", {typingclient:decryptedData, recievingclient:params.userId })
}
      }
     },[message])
    useEffect(()=>{
       socket.on("typers",(typers)=>{
  settypingclients(typers)
})
socket.on("sending message", data =>{
  const d = new Date()
  const text={
    sender:data.sender,
    reciever:data.reciever,
    message:data.message,
    connid:data.connid,
    status:data.status,
    time:d.getTime()
  }
  console.log("sending message")
  setAllmessages(prev => [...prev, text])
// allmessages[`conn${data.connid}`] ? setAllmessages(prev => ({...prev, [`conn${data.connid}`]:[...allmessages[`conn${data.connid}`],text]})) : setAllmessages(prev => ({...prev, [`conn${data.connid}`]:[text]}))
  setmessage("")

  /**
   *  
   */
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
  console.log("recieving message")
  setAllmessages(prev => [...prev, text])
 // allmessages[`conn${data.connid}`] ? setAllmessages(prev => ({...prev, [`conn${data.connid}`]:[...allmessages[`conn${data.connid}`],text]})) : setAllmessages(prev => ({...prev, [`conn${data.connid}`]:[text]}))

})
},[])
const fileinputClick =()=>{
  fileinput.current.click()
}
const Filechange =(e)=>{
  console.log("file changed")
  console.log(e.target.files)
  const reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])
  console.log(reader.result)
}
  const sendmessage=(e)=>{
    e.preventDefault()
      if(Cookies.get("cvyx") && params.userId  && params.userId  !== null && message.length > 0){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  const data ={
      message,
      sender:decryptedData, 
      reciever:params.userId ,
      connid:props.user.connid
    }
   
    socket.emit("send message", data)
   }
  }
   const displayinboxlinkheights =()=>{
    const element = document.querySelector(".displayicon")
    if(displayheight === "0px"){
      element.classList.remove("fa-ellipsis-v")
      element.classList.add("fa-times")
    }else{
      element.classList.remove("fa-times")
      element.classList.add("fa-ellipsis-v")
    }
   setdisplayheight(displayheight === "0px" ? " " : "0px")
  }
/**
 *   <div className="row" style={{backgroundColor:"#FF6347",width:"100%",padding:"8px",margin:"0"}}>
              <div className="col-1 d-md-none" style={{position:"relative"}}>
               <div style={{position:"absolute", top:"30%",color:"white"}}>
               <span className='fa fa-arrow-left'></span>
               </div>
              </div>
                <div className='col-2 col-md-2'>
                <img style={{borderRadius:"50%",width:"100%",padding:"5px",border:"2px solid lightgrey"}} src={props.user && props.user.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                </div>
                <div className='col-9 col-md-9' style={{position:"relative"}}>
                <div style={{position:"absolute",height:"100%",width:"100%",top:"20%",padding:"5px",left:"3px",lineHeight:"0.9"}}>
                                <small style={{fontSize:"18px",color:"white",fontWeight:"bold"}}>{props.user && props.user.name}</small>
                                <small style={{fontSize:"12px",color:"white"}}> @{props.user && props.user.username}</small><br/>
                                {typingclients.includes(parseInt(props.user && props.user.userid)) ? 
                                <i style={{fontSize:"12px",color:"green",fontWeight:"bold"}}> typing...</i>
                                 : props.online.includes(parseInt(props.user && props.user.userid)) ?                         
                                 <i style={{fontSize:"12px",color:"yellow",fontWeight:"bold"}}> Active</i>
                                 : props.lastseen[props.user.userid] ? 
                                 <i style={{fontSize:"12px",color:"lightgrey",fontWeight:"bold"}}>{formatlastSeen(props.lastseen[props.user.userid])}</i>
                                 : 
                                 <i style={{fontSize:"12px",color:"lightgrey",fontWeight:"bold"}}>{formatlastSeen(props.user.lastseen)}</i>}
                                
                                </div>
                </div>
            </div>
 */
    return ( 
        <div  style={{width:"100%",padding:"0",margin:"0",position:"static"}}>
        
            <div style={{position:"sticky",top:"0px",width:"100%",zIndex:"3"}}>
            <div style={{backgroundColor:"#FF6347",display:"flex",width:"100%",padding:"5px 8px",margin:"0"}}>
              <div className="d-md-none" style={{position:"relative",width:"5%"}}>
               <div style={{position:"absolute", top:"30%",color:"white"}}>
               <a href={`/connections/${ownerid}`} ><span className='fa fa-arrow-left' style={{fontSize:"25px",color:"white"}}></span></a>
               </div>
              </div>
                <div className='inboxImage'>
                <img style={{borderRadius:"50%",backgroundColor:"white",width:"100%",padding:"5px"}} src={props.user && props.user.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                </div>
                <div className='inboxDetails' style={{position:"relative"}}>
                <div style={{position:"absolute",height:"100%",width:"100%",top:"10%",padding:"5px",left:"3px",lineHeight:"0.9"}}>
                                <small style={{fontSize:"18px",color:"white",fontWeight:"bold"}}>{props.user && props.user.name}</small><br/>
                                <small style={{fontSize:"12px",color:"white"}}> @{props.user && props.user.username}</small><br/>
                                {typingclients.includes(parseInt(props.user && props.user.userid)) ? 
                                <i style={{fontSize:"12px",color:"green",fontWeight:"bold"}}> typing...</i>
                                 : props.online.includes(parseInt(props.user && props.user.userid)) ?                         
                                 <i style={{fontSize:"12px",color:"yellow",fontWeight:"bold"}}> Active</i>
                                 : props.lastseen[props.user.userid] ? 
                                 <i style={{fontSize:"12px",color:"lightgrey",fontWeight:"bold"}}>{formatlastSeen(props.lastseen[props.user.userid])}</i>
                                 : 
                                 <i style={{fontSize:"12px",color:"lightgrey",fontWeight:"bold"}}>{formatlastSeen(props.user.lastseen)}</i>}
                                
                                </div>
                </div>
                <div className='inboxSidelinks' style={{position:"relative"}}>
                  <span className='fa fa-ellipsis-v displayicon' onClick={displayinboxlinkheights} style={{position:"absolute",color:"white",top:"30%",right:"1px"}}></span>
                  <a href='/' style={{color:"white",textDecoration:"none"}}>
                  <span className='fa fa-home' style={{position:"absolute",top:"30%",left:"1px"}}></span>
                  </a>
                </div> 


                <div className='inboxdisplaylinks' style={{height:`${displayheight}`}}>
                {inboxlinks.map((inboxlink,i) =>               
                  <div key={i} style={{display:"flex",fontSize:"20px",justifyContent:"space-evenly"}}>
                     <div style={{width:"10%",fontSize:"25px"}}>
                     <span className={`fa fa-${inboxlink.fa}`} style={{color:`${inboxlink.fa === "ban" || inboxlink.fa === "trash" ? "red" : ""}`}} ></span>
                     </div>
                     <div style={{width:"80%"}}>
                <a  style={{textDecoration:"none",fontWeight:"bold",color:"black",textTransform:"capitalize"}} href={`/${inboxlink.url}`}>
                 <small>{inboxlink.name}</small>
                </a>
                </div>
                </div>
             )}
                </div>


            </div>
            </div>
            <div ref={refmessage} style={{width:"100%",height:"100%",marginTop:"10px",overflow:"scroll"}}>
              {allmessages.map((message, i) =>
                 <div className='mr-3 ml-3 mb-2' key={message.time} style={{display:`${(message.sender === ownerid && parseInt(message.reciever) === props.user.userid) || (message.reciever === ownerid && parseInt(message.sender) === props.user.userid) ? "block" : "none"}`}}>
                  {i === 0 || getSentTime(message.time) !== getSentTime(allmessages[i > 0 ? i-1 : 0].time) ? 
      <div style={{width:"100%",clear:"both"}}>
      <center>
        <small>
          <button style={{padding:"2px",border:"1px solid lightgrey",margin:"0px",textTransform:"uppercase",fontWeight:"bold"}}>
            <small>{getSentTime(message.time)}</small>
            </button>
          </small>
      </center>
      </div>
      : null}
                   <div className='mt-2' style={{float:`${message.sender === ownerid ? "right" : "left"}`,maxWidth:"70%",padding:"10px",borderRadius:"5px",clear:"both",border:`${message.sender === ownerid ? "1px solid #FF6347" : "1px solid lightgrey"}`}}>
                     <small >{message.message} </small><small className='mt-1' style={{float:"right",clear:"both",marginLeft:"5px"}}>{formater(message.time)} {message.sender === ownerid && message.status === "sent" ? 
                     <small style={{fontFamily:"FontAwesome"}} > &#xf00c;</small>
                    : message.sender === ownerid && message.status === "delivered" ? 
                    <small style={{fontFamily:"FontAwesome"}} > &#xf00c;&#xf00c;</small>
                   : message.sender === ownerid && message.status === "seen" ?
                   <small style={{fontFamily:"FontAwesome",color:"#1E90FF"}} > &#xf00c;&#xf00c;</small>
                  : message.sender === ownerid  ?
                  <small style={{fontFamily:"FontAwesome"}} > &#xf017;</small>
                : null}</small> <br/>
                     </div><br/><br/>
                 </div>
                )}
              </div>
              <div style={{backgroundColor:"white",height:"40px", width:"100%"}} ref={hiddenref}></div>
              <div style={{backgroundColor:"white",height:"100px",width:"100%"}}>
            <div className='messagebox' style={{position:"fixed",bottom:"0",backgroundColor:"white"}}>
               <form onSubmit={sendmessage}>
                <div className='row'>
                  <div className='col-1'>
                    <label for="fileinput">
                    <button className='btn' onClick={fileinputClick}   style={{border:"1px solid lightgrey",fontSize:"20px"}}>
                    <span className='fa fa-paperclip'></span>
                    </button>
                    </label>
                    <input type="file" ref={fileinput} onChange={Filechange} style={{display:"none"}}></input>
                  </div>
                    <div className='col-9'>
                        <input type="text" name='message' ref={inputref} onChange={change} value={message}  placeholder="&#xf044; Type Message" className='form-control' style={{border:"1px solid lightgrey",fontFamily:"FontAwesome",fontWeight:"bold",fontSize:"20px"}}/>
                    </div>
                     <div className='col-1' style={{padding:"5px"}}>
                    <center>
                    <button type="submit" className="btn btn-primary">Send</button>
                    </center>
                    </div>
                </div>
                </form>
            </div>
            </div>
        </div>
     );
}

export default Inbox;