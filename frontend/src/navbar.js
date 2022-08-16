import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import socket from "./socketconn"

import "./s.css"

function Navbar(props) {
  document.title ="Hormel Registration App!"
    const [display, changedisplay] = useState("none")
    const [navlinks, setnavlinks] = useState([{url:"",name:"home"},{url:"meet people",name:"meet people"},{url:"create group",name: "create group"},{url:"connections",name:"connections"},
    {url:"faq",name:"faq"}])
    const [subnavlinks, setsubnavlinks] = useState([{url:"/products",name:"Our Products"},{url:"blog",name: "blog"},{url:"Complaint",name:"Complaint"},
    {url:"policies",name:"Our policies"}])
    const [newmessages, setnewmessages] = useState({})

    const navref =useRef(false)
    
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
        nav.style.height = nav.style.height === "60vh" ? "0%" : "60vh"
        nav.style.width = nav.style.height === "100%" ? "0%" : "100%"
        }//https://realchatapps.herokuapp.com
        socket.on("recieving message", data =>{
          const d = new Date()
          const newtext={
            sender:data.sender,
            reciever:data.reciever,
            message:data.message,
            connid:data.connid,
            time:d.getTime()
          }
       //   {'sender':[messages]}, 'anothersender':[messages]}
        setnewmessages({...newmessages, [`${newtext.sender}`]:newtext})
        })
    return ( 
        <div style={{position:"fixed",top:"0px",width:"100%",zIndex:"1000"}}>
            <nav style={{padding:"0",margin:"0"}}>
                <div className='navdiv navdivlist' style={{margin:"0px",padding:"0px 10px",zIndex:"15"}}>
                  <div className='navbrand' >
                      <img style={{width:"100%",marginTop:"5px"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRF514mmQNz2OYCDUq8pIA2tRxg4lOzrn-yXA&usqp=CAU`} />
                  </div>
                  <div style={{width:"75%",display:"flex",justifyContent:"space-evenly"}}>
                  {navlinks.map((navlink,i) =>               
                  <div key={i} className='navdivlist'>
                <a  style={{textDecoration:"none",fontSize:"14px",color:"black",textTransform:"uppercase"}} href={`/${navlink.url}`}>
                  <p>{navlink.name}</p>
                </a>
                </div>
                )}
                <div className='navdivlist' style={{display:"flex",width:"20%",justifyContent:"space-between"}}>
               <div style={{position:"relative"}}>
                {Object.keys(newmessages).length > 0 ? 
                <span className='badge' style={{backgroundColor:"lightgrey",padding:"2px",borderRadius:"15px",fontSize:"17px"}}>
                 <a style={{color:"white",textDecoration:"none"}} href={`/chat/${Object.keys(newmessages)[Object.keys(newmessages).length -1]}?display=messages`}> 
                 <span  style={{textDecorspantion:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span  style={{color:"black",fontSize:"25px",color:"orange",fontFamily:"FontAwesome"}}><span className='fa fa-snapchat'></span></span>
                </span>
                <span className='badge ml-2' style={{backgroundColor:"green",padding:"3px",borderRadius:"15px",fontSize:"14px"}}> {Object.keys(newmessages).length}</span></a>
                </span> 
                : null}             
               </div>
               <div>
                <a  className="ml-2" style={{textDecoration:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span className='bagde' style={{backgroundColor:"indianred",padding:"2px 5px",borderRadius:"10px"}}>
                 <span className='fa fa-plug' style={{fontSize:"15px",color:"white"}}></span>
                 <span className='bagde ml-2' style={{backgroundColor:"green",padding:"5px",borderRadius:"10px"}}>
                 <span  style={{fontSize:"15px",color:"white"}}>{props.pendingconn && props.pendingconn.length}</span>
                 </span>
                 </span>
                </a>
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
                {Object.keys(newmessages).length > 0 ? 
                <span className='badge' style={{backgroundColor:"lightgrey",padding:"2px",borderRadius:"15px",fontSize:"17px"}}>
                 <a style={{color:"white",textDecoration:"none"}} href={`/chat/${Object.keys(newmessages)[Object.keys(newmessages).length -1]}?display=messages`}> 
                 <span  style={{textDecorspantion:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span  style={{color:"black",fontSize:"25px",color:"orange",fontFamily:"FontAwesome"}}><span className='fa fa-snapchat'></span></span>
                </span>
                <span className='badge ml-2' style={{backgroundColor:"green",padding:"3px",borderRadius:"15px",fontSize:"14px"}}> {Object.keys(newmessages).length}</span></a>
                </span> 
                : null}             
               </div>
               <div>
                <a  className="ml-2" style={{textDecoration:"none",fontWeight:"bolder",color:"black",textTransform:"uppercase"}} >
                 <span className='bagde' style={{backgroundColor:"indianred",padding:"2px 5px",borderRadius:"10px"}}>
                 <span className='fa fa-plug' style={{fontSize:"15px",color:"white"}}></span>
                 <span className='bagde ml-2' style={{backgroundColor:"green",padding:"5px",borderRadius:"10px"}}>
                 <span  style={{fontSize:"15px",color:"white"}}>0</span>
                 </span>
                 </span>
                </a>
                </div>
                </div>
                <span onClick={displaynav} className='fa fa-bars' style={{float:"right",color:"grey",border:"2px solid grey",fontSize:"20px",padding:"5px",color:"grey",cursor:"pointer",transition:"opacity 2s"}}></span>
            </div>
            <div className='navdiv_sm' ref={navref}>
             <div style={{padding:"20px"}}>
                 {navlinks.map(navlink =>
                 <a style={{textDecoration:"none",color:"white"}} href={`/${navlink.url}`}><p >{navlink.name}</p></a>
                    )}              
             </div>
             <div  style={{position:"absolute",bottom:"20px",left:"30%"}}>
                      <center style={{fontWeight:"bold",color:"white",padding:"0px",margin:"0px",paddingBottom:"4px"}}>
                        <small style={{fontSize:"12px"}}><span style={{fontSize:"18px"}} className='fa fa-globe' ></span> | Support  | <a href="/login"  style={{color:"white",textDecoration:"none"}}>Login</a></small><br/>
                     <a href="/register" >
                     <button style={{backgroundColor:"indianred",fontWeight:"bold",border:"none",margin:"0px",borderRadius:"20px",color:"white",padding:"8px 13px "}}>
                        <small>SIGN UP FOR FREE</small>
                      </button>
                     </a>
                      </center>
                  </div>
            </div>
        </div>
     );
}

export default Navbar;