import React, { useState, useEffect,useRef } from 'react';
import { Link } from 'react-router-dom';
import socket from "./socketconn"
import {useNavigate, useParams} from "react-router-dom"
import Cookies from "js-cookie"
import axios from "axios"
import {formater, formatermain} from "./formatTime"

const CryptoJS = require("crypto-js")

function Connection(props) {
    const [typingclients, settypingclients] = useState([])
    const [conn,setconn] = useState([])
    const [allmessages,setAllmessages]=useState({})
    const [ownerid, setownerid] = useState({})
    const [groupdetails, setgroupdetails] = useState({})
    const [displaynewgroupmodal, setdisplaynewgroupmodal] = useState("none")
    const [allmessagecount,setAllmessagecount]= useState({})
    const [groupresponse, setgroupresponse] = useState({})
    const [groups, setgroups] = useState([])
      let navigate = useNavigate()
      const hiddenref = useRef(null)
      const isFirstRender = useRef(true)
      const querystring = new URLSearchParams(window.location.search)

        useEffect(()=>{
          if(Cookies.get("cvyx")) {
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          console.log("decryptedData",decryptedData)
          setownerid(parseInt(decryptedData))
          setgroupdetails({ownerid:parseInt(decryptedData)})
          axios.get(`https://realchatapps.herokuapp.com/fetch-connections?id=${decryptedData}`)
          .then(res => setconn(res.data))
          .catch(err => console.warn(err))
      //    setuserId(params.userId)
          }
       socket.on("typers",(typers)=>{
  settypingclients(typers)
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
        if(!allmessagecount[`${data.connid}`]){
          setAllmessagecount(prev => ({prev, [`${data.connid}`]: 1}))
        }else{
          setAllmessagecount(prev => ({prev, [`${data.connid}`]: parseInt(allmessagecount[`${data.connid}`]) + 1}))
        }
        setAllmessages(prev => ({...prev, [`${data.connid}`]:text}))
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
       console.log("message in connections",text)
        setAllmessages(prev => ({...prev, [`${data.connid}`]:text}))
    })
},[])
useEffect(()=>{
   socket.on("sending message", data =>{ 
  axios.get(`https://realchatapps.herokuapp.com/fetch-connections?id=${ownerid}`)
  .then(res => setconn(res.data))
  .catch(err => console.warn(err))
    })
    socket.on("recieving message", data =>{ 
      axios.get(`https://realchatapps.herokuapp.com/fetch-connections?id=${ownerid}`)
      .then(res => setconn(res.data))
      .catch(err => console.warn(err))
        })
})
const groupchange =(e)=>{
   setgroupdetails(prev => ({...prev, [e.target.name]: e.target.value}))
}
const creategroup=()=>{
  const group = JSON.stringify(groupdetails)
  axios.get(`https://realchatapps.herokuapp.com/create-group?group=${group}`)
  .then(res => setgroupresponse(res.data))
  .catch(err=> console.log(err))
}
useEffect(()=>{
  axios.get(`https://realchatapps.herokuapp.com/fetch-group?ownerid=${JSON.stringify(ownerid)}`)
  .then(res => {
    if( res.data.status === "success"){
      setgroups(res.data.groups)
    }
  })
  .catch(err=> console.log(err))
},[ownerid])
//overcomer
//we are good people with a very focus move to trust and believe in God
const Messages =()=>{
//  <small style={{color:"lightgrey",fontWeight:"bold"}}>{allmessages[`${connect.connid}`] && parseInt(allmessages[`${connect.connid}`].sender) === ownerid  ? "ME :" : connect.sender === ownerid ? "ME :" : null}</small>
    return ( 

        <div className='container' >
                      {conn.map(connect =>
                  
                        <div className='row'  key={connect.id} style={{padding:"5px 10px",borderBottom:"0.4px solid lightgrey"}}>
                            <div className='col-3' style={{padding:"5px"}}>
                                <img style={{borderRadius:"50%",width:"100%",border:"2px solid lightgrey",padding:"5px"}} src={connect.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                            </div>
                            <div className='col-8' style={{position:"relative"}}>
                                <div style={{position:"absolute",top:"20%",lineHeight:"1",width:"100%"}}>
                              <a style={{textDecoration:"none"}} href={`/chat/${connect.userid}?display=messages`}><small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{connect.name}</small> </a>
                                <small className='mt-1' style={{float:"right",clear:"both",color:"black",marginLeft:"5px"}}>{connect.message ? formatermain(connect.time) : null}</small> 
                             
                                 <small className='ml-1'>{props.online.includes(connect.userid) ? <span style={{color:"#1E90FF"}} className="fa fa-circle"></span> : ""}</small><br/>
                                <small className='text-muted' style={{fontSize:"12px",padding:"0",margin:"0"}}>@{connect.username}</small> <br/>
                               <div style={{display:"flex",flexWrap:"nowrap",padding:"5px 2px"}}>
                                 <div style={{width:"90%"}}>
                                   <small style={{color:"grey"}}>
                                   
                                   { parseInt(connect.sender) === ownerid && connect.status === "sent" ? 
                     <small style={{fontFamily:"FontAwesome"}}> &#xf00c;</small>
                    : parseInt(connect.sender) === ownerid && connect.status === "delivered" ? 
                    <small style={{fontFamily:"FontAwesome"}} > &#xf00c;&#xf00c;</small>
                   : parseInt(connect.sender) === ownerid && connect.status === "seen" ?
                   <small style={{fontFamily:"FontAwesome",color:"#1E90FF"}}> &#xf00c;&#xf00c;</small> 
                  : null}
                                   </small>
                                 
                                   <small style={{fontSize:"13px",color:"black"}}> {connect.message && connect.message.length > 28 ? connect.message.slice(0,28) + "...": connect.message}</small>
                                  
                                   </div>
                                   <div style={{width:"10%"}}>

                               <small style={{float:"right"}}> 
                               {allmessagecount[connect.connid] ?
                               <div style={{color:"green",fontSize:"30px"}}>*</div>
                               : null}</small>
                                 </div>
                                 </div>
                               <small style={{display:"none"}}>{typingclients.includes(connect.id) ? <i style={{color:"green"}} >typing ...</i> : ""}</small>
                                </div>
                            </div>
                        </div>
                   
                        )}
             
        </div>
     );
  }
  const Groups =()=>{
    return(
      <div className='container'>
        {groups && groups.length > 0 ? groups.map(group =>
        <div className='row' key={group.groupId}>
           <div className='col-3' style={{padding:"5px"}}>
         <img style={{borderRadius:"50%",width:"100%",border:"2px solid lightgrey",padding:"5px"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZGwJBI7Lc_HwIroVIGs9zWvHTUf9XK40STQ&usqp=CAU`} />
     </div>
     <div className='col-9' style={{position:"relative"}}>
         <div style={{position:"absolute",top:"20%",lineHeight:"1",width:"100%"}}>
       <a style={{textDecoration:"none"}} href={`/group/${group.title}/${group.groupId}`}><small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{group.title}</small> </a><br/>
         <small className='mt-1' style={{float:"right",clear:"both",color:"black",marginLeft:"5px"}}>created {formatermain(group.time)}</small> 
      
     </div>
     </div>
        </div>
        ) : <h1 style={{marginTop:"40vh"}}>You Have not joined any group yet</h1>}
      </div>
    )
  }
  const Creategroupmodal =()=>{
   return(
    <div style={{display:`${displaynewgroupmodal}`}}>
    <div style={{position:"fixed",top:"0px",zIndex:"10000",height:"100%",width:"100%",backgroundColor:"rgba(0,42,55,0.4)"}}>
  </div>
  <div style={{position:"fixed",top:"30%",padding:"50px 30px",height:"45%",left:"35%",width:"30%",borderRadius:"10px",backgroundColor:"white",zIndex:"100000"}}>
    <div style={{position:"absolute",right:"10px",top:"10px"}}>
      <span className='fa fa-times' onClick={()=>setdisplaynewgroupmodal("none")} style={{fontSize:'17px'}}></span>
    </div>
   <center><p style={{color: groupresponse && groupresponse.status === "fail" ? "red" : "green",textTransform:"capitalize"}}>*{groupresponse && groupresponse.message}</p></center>
      <input type="text" value={groupdetails.grouptitle ? groupdetails.grouptitle : ""} name="grouptitle" onChange={groupchange} className='form-control' placeholder='Enter new group title' />
      <br/>
      <textarea  className='form-control' value={groupdetails.groupabout ? groupdetails.groupabout : ""} name="groupabout" onChange={groupchange} placeholder={`about ${groupdetails && groupdetails.grouptitle} group`} />
      <br/>
      <button className='btn btn-primary' onClick={creategroup} style={{width:"100%",borderRadius:"50px"}}>CREATE GROUP</button>
  </div>
  </div>
   )
  }
  return(
    <div style={{padding:"0",margin:"0"}}>
   
         <div style={{position:"sticky",padding:"20px",borderBottom:"1px solid lightgrey",top:"0px",width:"100%",backgroundColor:"white",left:"2%",zIndex:"20"}}>
        <div style={{display:"flex"}}>
        <div style={{width:"33.3%",position:"relative",textAlign:"center"}} onClick={()=>setdisplaynewgroupmodal("block")}>
          <span className='fa fa-users fa-2x' style={{color:"indianred"}}></span>
            <span style={{position:"absolute",fontSize:"20px",bottom:"0px",color:"indianred"}}>+</span>
          </div>
          <div style={{width:"33.3%",position:"relative",textAlign:"center"}}>
          <a href ="?display=groups">
          <span className='fa fa-users fa-2x' style={{color:"grey"}}></span>
          </a>
          </div>
          <div style={{width:"33.3%",position:"relative",textAlign:"center"}}>
          <a href ="?display=messages">
          <span className='fa fa-comment-o fa-2x' style={{color:"green"}}></span>
          </a>
          </div>
        </div>
           </div>
           < Creategroupmodal />
{ querystring.get("display") === "messages" ?
    <Messages />
    : null}
    { querystring.get("display") === "groups" ?
    <Groups />
    : null}
    </div>
  )
}

export default (Connection);
/**
 *  <Link to={`/chat/${connect.userid}`} >
                        <div className='row'  key={connect.id} style={{padding:"5px",borderBottom:"0.4px solid lightgrey"}}>
                            <div className='col-3' style={{padding:"5px"}}>
                                <img style={{borderRadius:"50%",width:"100%",border:"2px solid lightgrey",padding:"5px"}} src={connect.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                            </div>
                            <div className='col-9' style={{position:"relative"}}>
                                <div style={{position:"absolute",top:"20%",lineHeight:"1",width:"100%"}}>
                                <small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{connect.name}</small> 
                                <small className='mt-1' style={{float:"right",clear:"both",color:"black",marginLeft:"5px"}}>{allmessages[connect.connid] ? formatermain(allmessages[connect.connid].time) : connect.message ? formatermain(connect.time) : null}</small> 
                             
                                 <small className='ml-1'>{props.online.includes(connect.userid) ? <span style={{color:"#1E90FF"}} className="fa fa-circle"></span> : ""}</small><br/>
                                <small className='text-muted' style={{fontSize:"12px",padding:"0",margin:"0"}}>@{connect.username}</small> <br/>
                               <div style={{display:"flex",flexWrap:"nowrap",padding:"5px 2px"}}>
                                 <div style={{width:"90%"}}>
                                   <small style={{color:"grey"}}>
                                   
                                   {allmessages[connect.connid] && parseInt(allmessages[connect.connid].sender) === ownerid && allmessages[connect.connid].status === "sent" ? 
                     <small style={{fontFamily:"FontAwesome"}}> &#xf00c;</small>
                    : allmessages[connect.connid] && parseInt(allmessages[connect.connid].sender) === ownerid && allmessages[connect.connid].status === "delivered" ? 
                    <small style={{fontFamily:"FontAwesome"}} > &#xf00c;&#xf00c;</small>
                   : allmessages[connect.connid] && parseInt(allmessages[connect.connid].sender) === ownerid && allmessages[connect.connid].status === "seen" ?
                   <small style={{fontFamily:"FontAwesome",color:"#1E90FF"}}> &#xf00c;&#xf00c;</small>
                   : allmessages[connect.connid]  ?
                   null
                :  parseInt(connect.sender) === ownerid && connect.status === "sent" ? 
                     <small style={{fontFamily:"FontAwesome"}}> &#xf00c;</small>
                    : parseInt(connect.sender) === ownerid && connect.status === "delivered" ? 
                    <small style={{fontFamily:"FontAwesome"}} > &#xf00c;&#xf00c;</small>
                   : parseInt(connect.sender) === ownerid && connect.status === "seen" ?
                   <small style={{fontFamily:"FontAwesome",color:"#1E90FF"}}> &#xf00c;&#xf00c;</small> 
                  : null}
                                   </small>
                                 
                                   <small style={{fontSize:"13px",color:"black"}}> {allmessages[connect.connid] && allmessages[connect.connid].message.length > 30 ? allmessages[connect.connid].message.slice(0,30) + "..." 
                                   : allmessages[connect.connid] && allmessages[connect.connid].message.length <= 30 ?  allmessages[connect.connid].message : connect.message}</small>
                                  
                                   </div>
                                   <div style={{width:"10%"}}>

                               <small style={{float:"right"}}> 
                               {allmessagecount[connect.connid] ?
                               <div style={{color:"green",fontSize:"30px"}}>*</div>
                               : null}</small>
                                 </div>
                                 </div>
                               <small style={{display:"none"}}>{typingclients.includes(connect.id) ? <i style={{color:"green"}} >typing ...</i> : ""}</small>
                                </div>
                            </div>
                        </div>
                        </Link>
 */