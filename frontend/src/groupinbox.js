import axios from 'axios';
import React, { useState, useEffect , useRef} from 'react';
import {useParams, Navigate} from "react-router-dom"
import Cookies from 'js-cookie';
import socket from "./socketconn"
import { formater, formatlastSeen, getSentTime } from './formatTime';
import { useContext } from 'react';
import { userContext } from './contextJs';

const CryptoJS = require("crypto-js")

function Groupinbox(props) {
    const [user, setuser] = useState("")
    const [groupdetails, setgroupdetails] = useState({})
    const [ownerid, setownerid] = useState("")
    const [value, setvalue] = useState("")
    const [redirect, setredirect] = useState(false)
    const {gpmess} = useContext(userContext)
    const [grpmessages, setgrpmessages] = gpmess;
    const [messages, setmessages] = useState([])
    const [savedmessages, setsavedmessages] = useState([])
    const [typingmessage, setTypingClientMessage] = useState("")
    const [groupmembers, setgroupmembers] = useState([])

    const refmessage= useRef(null)
    const inputref=useRef(null)
    const hiddenref= useRef(null)
    const params = useParams()

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
    useEffect(()=>{
        if(refmessage.current && (savedmessages.length > 0 || messages.length > 0)){
        refmessage.current.scrollTop =  refmessage.current.scrollHeight;
        hiddenref.current.scrollIntoView({behavior:"smooth"})
        }
      },[savedmessages, messages])
    useEffect(()=>{
        window.addEventListener("keyup",()=>{
            inputref.current.focus()
          })
        axios.get(`http://localhost:5000/fetch-groupmessages?groupid=${params.groupid}`)
        .then(res => {
            if(res.data.status === "success"){
                setsavedmessages(res.data.savedmessages)
            }
        })
        .catch(err=> console.log(err))
    },[])
    
    useEffect(()=>{
        socket.on("room_message_delivery", data=>{
            if(data.title === groupdetails.title){
          setmessages(prev =>([...prev, data]))
            }
            hiddenref.current.scrollIntoView({behavior:"smooth"})
            })
            socket.on("typing_group_broadcast",data =>{
              setTypingClientMessage(`${data.username} is typing`)
            })
    },[])

 useEffect(()=>{
    if(Cookies.get("cvyx")) {
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      setuser(decryptedData)
      setownerid(decryptedData)
  axios.get(`http://localhost:5000/fetch-groupinfo?groupid=${params.groupid}`)
  .then(res => {
    if(res.data.status === "success"){
        setgroupdetails(res.data.groupdetails)
        setgroupmembers(res.data.groupmembers)
    }
  })
  .catch(err => console.log("err",err))
}
 },[])
 const change=(e)=>{
  setvalue(e.target.value)
  if(e.target.value.length > 0){
  let d= new Date()
    const data = {
      type:"text", 
      sender: user,
      username:props.user.username,
      room: groupdetails.title,
      room_id:groupdetails.groupId,
      time:d.getTime()
     }
    socket.emit("typing_group", data)
  }else{
     setTypingClientMessage("")
     
  }
 }
 const submit =(e)=>{
   e.preventDefault()
   let d = new Date()
   const data = {
    type:"text", 
    sender: user,
    username:props.user.username,
    room: groupdetails.title,
    room_id:groupdetails.groupId,
    message: value,
    status:"",
    time:d.getTime()
   }
   socket.emit("room_message", data)
   setvalue("")
   if(typingmessage === `${data.username} is typing`){
    setTypingClientMessage("")
   }
 }
if(redirect){
   <Navigate to="/login" />
}else{
    return ( 
        <div  style={{padding:"0",margin:"0",position:"static"}}>
        <div style={{position:"sticky",top:"0px",width:"100%",zIndex:"3"}}>
        <div style={{backgroundColor:"#FF6347",display:"flex",width:"100%",padding:"5px 8px",margin:"0"}}>
          <div className="d-md-none" style={{position:"relative",width:"7%"}}>
           <div style={{position:"absolute", top:"30%",color:"white"}}>
           <a href={`/connections/?display=groups`} ><span className='fa fa-arrow-left' style={{fontSize:"25px",color:"white"}}></span></a>
           </div>
          </div>
            <div className='inboxImage'>
              <a href={`/profile/group/${groupdetails.groupId}`}>
            <img style={{borderRadius:"50%",height:"70px",backgroundColor:"white",width:"100%",padding:"0px"}} src={groupdetails && groupdetails.image ? `https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${groupdetails.image}` : `https://media.istockphoto.com/photos/multi-ethnic-guys-and-girls-taking-selfie-outdoors-with-backlight-picture-id1368965646?k=20&m=1368965646&s=612x612&w=0&h=l4KtTSXp0ARHvLGse-9BHCBhG3gnRR2OsZzT0LwHCVw=`} />
            </a>
            </div>
            <div className='inboxDetails' style={{position:"relative"}}>
            <div style={{position:"absolute",height:"100%",width:"100%",top:"10%",padding:"5px",left:"3px",lineHeight:"1.2"}}>
                            <small style={{fontSize:"18px",color:"white",fontWeight:"bold",textTransform:"uppercase"}}>{groupdetails && groupdetails.title}</small><br/>
                             <span>
                            {typingmessage.length > 0 ? 
                           <i style={{color:'lightgreen',fontWeight:"bold"}}>{typingmessage}</i>
                           :
                           groupmembers.length > 3 ? groupmembers.slice(0,3).map((member, index)=>   
                          
                            <small key={index} style={{fontSize:"12px",color:"white",textTransform:"capitalize"}}>
                              {index === 2 ?
                              <span>
                                 {member.username} <b> ... {groupmembers.length-3} others</b>
                              </span>
                               : member.username + " , "}
                              </small>            
                                ) 
                              : 
                              groupmembers.map((member, index)=>   
                              <small key={index} style={{fontSize:"12px",color:"white",textTransform:"capitalize"}}>
                               {index + 1 === groupmembers.length ? member.username : member.username + " , "}
                               </small> 
                                 )}
                                  </span> 
                           <br/>
                        
                            <small style={{color:"lightgrey",fontSize:"11px"}}>Formed {groupdetails.date+ " " + groupdetails.month+ " , " +groupdetails.year} </small>
                           
                            
                            </div>
            </div>
            <div className='inboxSidelinks' style={{position:"relative"}}>
              <span className='fa fa-ellipsis-v displayicon' style={{position:"absolute",color:"white",top:"30%",right:"1px"}}></span>
              <a href='/' style={{color:"white",textDecoration:"none"}}>
              <span className='fa fa-home' style={{position:"absolute",top:"30%",left:"1px"}}></span>
              </a>
            </div> 


          
        </div>
        </div>
        <div className='inboxbackground' style={{height:"100%",zIndex:"-3",top:"10%",backgroundSize:"cover",position:"fixed",backgroundRepeat:"no-repeat",backgroundPosition:"center",opacity:"0.7",marginTop:"10px"}}>
          </div>
        {groupdetails.members  && JSON.parse(groupdetails.members).includes(parseInt(user)) ?       
        <div  style={{width:"100%",minHeight:"100%",zIndex:"20",marginTop:"10px",overflow:"scroll"}}>
 
          </div>

          : <div style={{width:"100%",height:"100%",marginTop:"10px",overflow:"scroll"}}>
            <p style={{textAlign:"center",color:"red"}}>You Cannot send messages to this group </p><br/>
            <p>Click Here to join this group</p>
            </div>}
            <div ref={refmessage} style={{width:"100%",minHeight:"100%",zIndex:"20",marginTop:"10px",overflow:"scroll"}}>
            {savedmessages && savedmessages.map((message, i) =>
                 <div className='mr-3 ml-3 mb-2 mt-3' key={message.time} style={{height:"100%"}}>
                   <div className='mt-2' style={{backgroundColor:`${message.sender === ownerid ? "white" : "pink"}`,float:`${message.sender === ownerid ? "right" : "left"}`,maxWidth:"70%",padding:"5px",borderRadius:"5px",clear:"both",border:`${message.sender === ownerid ? "1px solid #FF6347" : "1px solid lightgrey"}`}}>
                   <small style={{fontSize:"11px",color:`${message.sender === ownerid ? "green" : "indianred"}`,fontWeight:"bold"}}>{message.username}</small><br/>
                     <small style={{fontSize:"13px"}} >{message.message} </small><small className='mt-1' style={{textAlign:"right",clear:"both",marginLeft:"5px",fontSize:'13px'}}>{formater(message.time)} {message.sender === ownerid && message.status === "sent" ? 
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
              {messages && messages.map((message, i) =>
                 <div className='mr-3 ml-3 mb-2 mt-3' key={message.time} style={{height:"100%"}}>

                   <div className='mt-2' style={{backgroundColor:`${message.sender === ownerid ? "white" : "pink"}`,float:`${message.sender === ownerid ? "right" : "left"}`,maxWidth:"70%",padding:"10px",borderRadius:"5px",clear:"both",border:`${message.sender === ownerid ? "1px solid #FF6347" : "1px solid lightgrey"}`}}>
                   <small style={{fontSize:"11px",color:`${message.sender === ownerid ? "green" : "indianred"}`,fontWeight:"bold"}}>{message.username}</small><br/>
                     <small style={{fontSize:"13px"}} >{message.message} </small><small className='mt-1' style={{textAlign:"right",clear:"both",marginLeft:"5px",fontSize:'13px'}}>{formater(message.time)} {message.sender === ownerid && message.status === "sent" ? 
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
          <div style={{height:"5px", width:"100%",marginBottom:"10%"}} ref={hiddenref}></div>
          <div style={{backgroundColor:"white",width:"100%"}}>
      
        <div className="inboxinput" style={{position:"fixed",bottom:"0px",padding:"0px 10px",margin:"0px"}}>
               <form onSubmit={submit}>
                   <div className="input-group mb-3" >
                   <div className="input-group-prepend">
                <button className={`btn `} style={{fontSize:"20px",backgroundColor:"white",border:"1px solid lightgrey",borderTopLeftRadius:"20px",borderBottomLeftRadius:"20px",borderRight:"none"}} type="submit">
                    <span  className="fa fa-smile text-muted"></span>
                </button>  
                 </div>        
                  <input type="text" ref={inputref} value={value} onChange={change} className="form-control form-control-lg navsearch" name='message'   placeholder="&#xf044; Type Message" style={{border:"1px solid lightgrey",backgroundColor:"white",fontSize:"18px",borderLeft:"0",fontFamily:"FontAwesome",borderRight:"0"}}  />
                 <div className="input-group-append">
                <button style={{border:"1px solid lightgrey",borderTopRightRadius:"20px",borderBottomRightRadius:"20px",borderLeft:"none",backgroundColor:"white"}}  type="submit">
                    <span style={{fontSize:"20px"}} className="fa fa-camera text-muted"></span>
                </button>  
                 </div>
                 <div className="input-group-append" style={{padding:"5px"}}>
                <button type="submit" className={`btn btn-primary`} style={{borderRadius:"40px"}} >
                    <span style={{color:"white"}} className="fa fa-paper-plane"></span>
                </button>  
                 </div>
                </div>
                 </form>
                 </div> 
        </div>
        </div>
     );
}
}
//display:`${(message.sender === ownerid) || (parseInt(message.sender) === props.user.userid) ? "block" : "none"}`
export default Groupinbox;