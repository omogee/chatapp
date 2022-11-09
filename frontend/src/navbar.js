import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import socket from "./socketconn"
import "./main.css"
import axios from "axios"
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import "./s.css"

const CryptoJS = require("crypto-js")

function Navbar(props) {
  document.title ="Hormel Registration App!"
    const [display, changedisplay] = useState("none")
    const [navlinks, setnavlinks] = useState([{url:"",name:"home"},{url:"?user=true",name:"meet people"},{url:`connections`,name:"connections"},
    {url:"profile",name:"profile"}])
    const [smnavlinks, setsmnavlinks] = useState([{url:"",name:"home"},{url:"users",name:"meet people"},{url:`connections`,name:"connections"},
    {url:"profile",name:"profile"}])
    const [subnavlinks, setsubnavlinks] = useState([{url:"/products",name:"Our Products"},{url:"blog",name: "blog"},{url:"Complaint",name:"Complaint"},
    {url:"policies",name:"Our policies"}])
    const [newmessages, setnewmessages] = useState([])
    const [grouptitle, setgrouptitle] = useState("")
    const [groupabout, setgroupabout] = useState("")
    const [groupresponse, setgroupresponse] = useState({})
    const [noOfUnreadMessages, setnoOfUnreadMessages] = useState([])
    const [noOfUnreadChat, setnoOfUnreadChat] = useState([])
  const [lastunreadindex, setlastunreadindex] = useState('')
    const [displaynewgroupmodal, setdisplaynewgroupmodal] = useState("none")

    const params = useParams()

    const navref =useRef(false)
    useEffect(()=>{
      if(Cookies.get("cvyx")){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      axios.get(`http://localhost:5000/fetch-justuser?id=${decryptedData}`)
    .then(res => {
      setnoOfUnreadMessages(res.data.noOfUnreadMessages)
      console.log("res.data.noOfUnreadMessages",res.data.noOfUnreadChat)
      setnoOfUnreadChat(res.data.noOfUnreadChat)
      setlastunreadindex(res.data.lastunreadindex)
    })
    .catch(err => console.log(err))
  }
    },[])
    const displaynav=(e)=>{
        let nav = document.querySelector(".navdiv_sm")
        if(nav.style.height === "60vh"){
          setTimeout(()=>{
            e.target.classList.add("fa-bars")
            e.target.classList.remove("fa-times")
          },1000)
        }else{
           setTimeout(()=>{
            e.target.classList.add("fa-times")
            e.target.classList.remove("fa-bars")
           },1000)
        }
        nav.style.height = nav.style.height === "60vh" ? "0px" : "60vh"
        nav.style.width = nav.style.height === "100%" ? "0px" : "100%"
        }//http://localhost:5000
        useEffect(()=>{
          socket.on("recieving message", data =>{
            const d = new Date()
            const newtext={
              sender:data.sender,
              reciever:data.reciever,
              message:data.message,
              connid:data.connid,
              time:d.getTime()
            }
            
            //setnewmessages({...newmessages, [`${newtext.sender}`]:newtext})
         //   {'sender':[messages]}, 'anothersender':[messages]}
         const findany = noOfUnreadMessages.find(chat => chat.sender == chat.sender )
        if(!findany){
              noOfUnreadChat(prev=> prev + 1)
        }else{
          alert("e dey oo")
        }
           setnoOfUnreadMessages(prev => ([...prev, newtext]))
         } )
        },[])
        useEffect(()=>{
          console.log("noOfUnreadMessages",noOfUnreadMessages)
        },[newmessages])
        /**
         *    <div style={{position:"relative"}}>
                {Object.keys(newmessages).length > 0 ? 
                <span className='badge mr-3' style={{backgroundColor:"lightgrey",padding:"2px",borderRadius:"15px",fontSize:"17px"}}>
                 <a style={{color:"white",textDecoration:"none"}} href={`/chat/${Object.keys(newmessages)[Object.keys(newmessages).length -1]}?display=messages`}> 
                 <span  style={{textDecorspantion:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span  style={{color:"black",fontSize:"25px",color:"orange",fontFamily:"FontAwesome"}}><span className='fa fa-snapchat'></span></span>
                </span>
                <span className='badge ml-2' style={{backgroundColor:"green",padding:"3px",borderRadius:"15px",fontSize:"14px"}}> {Object.keys(newmessages).length}</span></a>
                </span> 
                : null}             
               </div>
         */
               const grouptitlechange =(e)=>{
               setgrouptitle(e.target.value)
             }
             const groupaboutchange =(e)=>{
              setgroupabout(e.target.value)
           }
             const creategroup=()=>{
              const groupdetails = {
                grouptitle,
                groupabout
              }
               const group = JSON.stringify(groupdetails)
               axios.get(`http://localhost:5000/create-group?group=${group}`)
               .then(res => {
                if(res.data.status === "success"){
                  setgroupresponse(res.data)
                  setgroupabout("")
                  setgrouptitle("")
                  setTimeout(()=>{
                    setdisplaynewgroupmodal("none")
                  },1000)
                }
               })
               .catch(err=> console.log(err))
             }
              
              
    return ( 
        <div style={{position:"fixed",top:"0px",width:"100%",zIndex:"1000"}}>
         <div style={{display:`${displaynewgroupmodal}`}}>
                 <div style={{position:"fixed",top:"0px",zIndex:"10000",height:"100%",width:"100%",backgroundColor:"rgba(0,42,55,0.4)"}}>
               </div>
               <div className="creategroupmodal" style={{position:"fixed",padding:"50px 30px",borderRadius:"10px",backgroundColor:"white",zIndex:"100000"}}>
                 <div style={{position:"absolute",right:"10px",top:"10px"}}>
                   <span className='fa fa-times' onClick={()=>setdisplaynewgroupmodal("none")} style={{fontSize:'17px'}}></span>
                 </div>
                <center><p style={{color: groupresponse && groupresponse.status === "fail" ? "red" : "green",textTransform:"capitalize"}}>*{groupresponse && groupresponse.message}</p></center>
                   <input type="text" name="grouptitle" value={grouptitle} onChange={grouptitlechange} className='form-control' placeholder='Enter new group title' />
                   <br/>
                   <textarea  className='form-control' name="groupabout" value={groupabout} onChange={groupaboutchange} placeholder={`about ${grouptitle} group`} />
                   <br/>
                   <button className='btn btn-primary' onClick={creategroup} style={{width:"100%",borderRadius:"50px"}}>CREATE GROUP</button>
               </div>
               </div>
            <nav style={{padding:"0",margin:"0"}}>
                <div className='navdiv navdivlist' style={{margin:"0px",padding:"0px 10px",zIndex:"15"}}>
                  <div className='navbrand' >
                      <img style={{width:"100%",marginTop:"5px"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF514mmQNz2OYCDUq8pIA2tRxg4lOzrn-yXA&usqp=CAU`} />
                  </div>
                  <div style={{width:"75%",display:"flex",justifyContent:"space-evenly"}}>
                  {navlinks.map((navlink,i) =>               
                  <div key={i} className='navdivlist'>
                <a className='navlinks'  style={{textDecoration:"none",fontSize:"14px",color:"black",textTransform:"uppercase"}} href={navlink.url === "profile" ? `/${navlink.url}/${props.user.userid}` : navlink.url === "connections" ? `/chat/${lastunreadindex ? lastunreadindex : 0}?display=messages` : `/${navlink.url}`}>
                  <p>{navlink.name} </p>
                </a>
                </div>
                )}
                 <div  className='navdivlist'>                
                  <p style={{fontSize:"14px",color:"black",cursor:"pointer"}} onClick={()=>setdisplaynewgroupmodal("block")}>GROUP+ {newmessages.length}</p>          
                </div>
                <div className='navdivlist' style={{display:"flex",position:"relative",width:"20%",justifyContent:"space-between"}}>
               <div style={{position:"relative"}}>
                {noOfUnreadMessages.length > 0 ? 
                <span className=' mr-3' title={`You have ${noOfUnreadMessages.length} from ${noOfUnreadChat.length} chat`} style={{padding:"2px",position:"relative",borderRadius:"15px",fontSize:"17px"}}>
                 <a style={{color:"white",textDecoration:"none"}} href={props.lastunreadindex ? `/chat/${noOfUnreadMessages[0].sender}?display=messages` : `/`}> 
                 <span  style={{textDecorspantion:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span  style={{color:"black",fontSize:"25px",color:"grey",fontFamily:"FontAwesome"}}><span className='fa fa-bell-o'></span></span>
                 <span className='badge' style={{backgroundColor:"red",position:"absolute",top:"-10px",right:"-2px",padding:"2px 4px",borderRadius:"50%",fontSize:"14px"}}> {noOfUnreadMessages.length}</span>  </span>
               </a>
                </span> 
                : null}     
                     
               </div>
               <div>
                <span className='bagde' style={{position:"relative"}}>
                <a  className="ml-2 mr-3" style={{textDecoration:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >        
                 <span className='fa fa-plus-circle' style={{fontSize:"30px",color:"grey"}}></span>
                 <span className='bagde ml-2' style={{backgroundColor:"red",position:"absolute",top:"-20px",right:"3px",padding:"0px 3px",borderRadius:"50%"}}>
                 <span  style={{fontSize:"13px",color:"white"}}>{props.requestedconn && props.requestedconn.length}</span>
                 </span>
                   </a>
                 </span>
              
                </div>
               <div>
                <a  className="ml-2" style={{textDecoration:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span className='fa fa-search  text-muted' style={{fontSize:"20px"}}></span>
                </a>
                </div>
                </div>
             </div>
                   <div  style={{width:"16%",order:"3",padding:"0px",margin:"0px",position:"absolute",top:"0px",left:"84%"}}>
                      <center style={{fontWeight:"bold",color:"rgb(0, 34, 102)",padding:"0px",margin:"0px",paddingBottom:"4px"}}>
                        <small style={{fontSize:"12px"}}><span style={{fontSize:"18px"}} className='fa fa-globe' ></span> | Support  | <a href="/login"  style={{color:"rgb(0, 34, 102)",textDecoration:"none"}}>Login</a></small><br/>
                     <a href="/register" >
                     <button style={{backgroundColor:"indianred",fontWeight:"bold",border:"none",margin:"0px",borderRadius:"20px",color:"white",fontSize:"14px",padding:"2px 13px "}}>
                        <small>SIGN UP FOR FREE</small>
                      </button>
                     </a>
                      </center>
                  </div>
                </div>
            </nav>
          
            <div className='bardiv' style={{display:"absolute",top:"5px",width:"100%",height:"12vh",backgroundColor:"white",opacity:"0.9", right:"0px",padding:"10px"}}>
            <div className='navbrand_sm'>
                      <img style={{width:"100%"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF514mmQNz2OYCDUq8pIA2tRxg4lOzrn-yXA&usqp=CAU`} />
                  </div>
                  <div style={{display:"flex",position:"absolute",top:'20%',right:"10%"}}>
                  <div style={{position:"relative"}}>
                
                  {noOfUnreadMessages.length > 0 ? 
                <span className=' mr-3' title={`You have ${noOfUnreadMessages.length} from ${noOfUnreadChat.length} chat`} style={{padding:"2px",position:"relative",borderRadius:"15px",fontSize:"17px"}}>
                 <a style={{color:"white",textDecoration:"none"}} href={props.lastunreadindex ? `/chat/${noOfUnreadMessages[0].sender}?display=messages` : `/`}> 
                 <span  style={{textDecorspantion:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span  style={{color:"black",fontSize:"25px",color:"grey",fontFamily:"FontAwesome"}}><span className='fa fa-bell-o'></span></span>
                 <span className='badge' style={{backgroundColor:"red",position:"absolute",top:"-10px",right:"-2px",padding:"2px 4px",borderRadius:"50%",fontSize:"14px"}}> {noOfUnreadMessages.length}</span>  </span>
               </a>
                </span> 
                : null}       
               </div>
               <div>
               <span className='bagde' style={{position:"relative"}}>
                <a  className="ml-2 mr-3" style={{textDecoration:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >        
                 <span className='fa fa-plus-circle' style={{fontSize:"30px",color:"grey"}}></span>
                 <span className='bagde ml-2' style={{backgroundColor:"red",position:"absolute",top:"-20px",right:"3px",padding:"0px 3px",borderRadius:"50%"}}>
                 <span  style={{fontSize:"13px",color:"white"}}>{props.requestedconn && props.requestedconn.length}</span>
                 </span>
                   </a>
                 </span>
                </div>
                </div>
                <span onClick={displaynav} className='fa fa-bars' style={{float:"right",color:"grey",border:"2px solid grey",fontSize:"20px",padding:"5px",color:"grey",cursor:"pointer",transition:"opacity 2s"}}></span>
            </div>
            <div className='navdiv_sm' style={{height:"0px",overflow:"hidden",backgroundColor:"white",zIndex:"200000000"}} ref={navref}>
             <div style={{padding:"20px"}}>
                 {smnavlinks.map(navlink =>
                 <a className='navlinks' style={{textDecoration:"none"}} href={navlink.url === "profile" ? `/${navlink.url}/${props.user.userid}`: navlink.url === "connections" ? `/connections/${props.user && props.user.userid}?display=messages`: `/${navlink.url}`}><p style={{fontSize:"15px",textTransform:"capitalize"}}>{navlink.name}</p></a>
                    )}   
                            
             </div>
             <div className="signupsection" style={{position:"absolute",bottom:"20px",left:"30%"}}>
                      <center style={{fontWeight:"bold",color:"black",padding:"0px",margin:"0px",paddingBottom:"4px"}}>
                        <small style={{fontSize:"12px"}}><span style={{fontSize:"18px"}} className='fa fa-globe' ></span> | Support  | <a href="/login"  style={{color:"black",textDecoration:"none",fontWeight:"bold"}}>Login</a></small><br/>
                     <a href="/register" >
                     <button style={{backgroundColor:"indianred",fontWeight:"bold",border:"none",margin:"0px",borderRadius:"20px",color:"white",padding:"8px 13px "}}>
                        <small style={{fontWeight:"bold"}}>SIGN UP FOR FREE</small>
                      </button>
                     </a>
                      </center>
                  </div>
            </div>
        </div>
     );
}
/**
 *  {Object.keys(newmessages).length > 0 ? 
                <span className='badge mr-3' style={{backgroundColor:"lightgrey",padding:"2px",borderRadius:"15px",fontSize:"17px"}}>
                 <a style={{color:"white",textDecoration:"none"}} href={`/chat/${Object.keys(newmessages)[Object.keys(newmessages).length -1]}?display=messages`}> 
                 <span  style={{textDecorspantion:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span  style={{color:"black",fontSize:"25px",color:"orange",fontFamily:"FontAwesome"}}><span className='fa fa-snapchat'></span></span>
                </span>
                <span className='badge ml-2' style={{backgroundColor:"green",padding:"3px",borderRadius:"15px",fontSize:"14px"}}> {Object.keys(newmessages).length}</span></a>
                </span> 
                : null}  
 */
export default Navbar;