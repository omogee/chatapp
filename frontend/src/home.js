import React, { useState, useEffect,useRef} from 'react';
import background from "./homewallpaper.jpeg"
import Users from "./users"
import {useNavigate, useParams} from "react-router-dom"
import Cookies from "js-cookie"
import "./main.css"

function Home(props) {
  const [showusers, setShowusers] = useState("none")
  const [redirect, setredirect] = useState(false)
  const querystring = new URLSearchParams(window.location.search)
  const navigate =useNavigate()
  const isIniRender = useRef(true)
  const params = useParams()


  useEffect(()=>{
    if(!Cookies.get("cvyx")){
    setredirect(true)
    }
})
  useEffect(()=>{
    if(querystring.get("user") === "true" && redirect === false){
      setShowusers("block")
    }
  },[querystring])
 const displayusers=()=>{
   if(redirect === false){
    querystring.set("user", "true")
    navigate(window.location.pathname + "?" + querystring.toString())
   }else{
    window.location.assign('/login')
   }
  }
  const undisplayusers =()=>{
    setShowusers("none")
    querystring.delete("user")
    navigate(window.location.pathname + "?" + querystring.toString())
  }
    return ( 
        <div>
          <div style={{position:"fixed",bottom:"10px",right:"10px",zIndex:"100000"}}>
          <button className='btn' style={{borderRadius:"100px",fontWeight:"bold",textTransform:"uppercase",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}>
            <span className='fa fa-phone'> Contact Us</span>
          </button>
          </div>
          <div style={{marginTop:"15%",marginBottom:"5%"}}>
          <div className='container'>
            <div className='row' >
              <div className='col-7'>
                <div style={{padding:"50px"}}>
                 <h1>How to start a web design business from scratch</h1>
                 <p>Want to start a web design business? Read this informative guide for eight essential steps to consider when building a web design company.<br/>
                 Want to start a web design business? Read this informative guide for eight essential steps to consider when building a web design company.</p>
                 <button className='btn' style={{borderRadius:"100px",textAlign:"left",fontWeight:"bold",textTransform:"uppercase",backgroundColor:"indianred",color:"white"}}>
            <span className='fa fa-phone'> Contact Us</span>
          </button>
                </div>
              </div>
              <div className='col-5'>
                <img style={{width:"100%"}} src={`https://www.nicepng.com/png/detail/362-3623383_why-small-businesses-need-to-switch-to-responsive.png`}></img>
              </div>
            </div>
          </div>
          </div>
            <div style={{height:"60%",width:"100%",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundImage:`url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDyyqkcB2wKVYaECswnUbQKPfNlfmj2gHToLi_wct4H6qXwsysj0USJdrRr1edu6APoI0&usqp=CAU)`}}>
              <div>
                <img style={{width:"100%",height:"80vh"}} src={`https://assets-global.website-files.com/6009ec8cda7f305645c9d91b/6171cadd24b58d404be92289_how-to-start-a-design-business-from-scratch_BlogHero_A.jpg`} />
              </div>
        </div>
        <div className='container' style={{marginTop:"3%"}}>
          <div className='row'>
            <div className='col-4' style={{padding:"50px"}}>
              <img style={{width:"100%"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTeJE_PwbtP1uy-vdAJlT0u0CZsJ6L_4BWU60hrfATT_SbM3Kl3wqlDqXZ397P9rRpx99g&usqp=CAU`} /><br/><br/>
              <button className='btn' style={{borderRadius:"100px",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}><small>SEE MORE</small></button>
            </div>
            <div className='col-4' style={{padding:"50px"}}>
              <img style={{width:"100%"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ_jJU9NlPRb7nar1sapA7iVmDVMoeHHA3Pg&usqp=CAU`} /><br/><br/>
              <button className='btn' style={{borderRadius:"100px",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}><small>SEE MORE</small></button>
            </div>
            <div className='col-4' style={{padding:"50px"}}>
              <img style={{width:"100%"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtHyqoUGgPto3xbwttzrpAoWr3RkQX1VsQIA&usqp=CAU`} /><br/><br/>
              <button className='btn' style={{borderRadius:"100px",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}><small>SEE MORE</small></button>
            </div>
          </div>
        </div>
        <div>
        <div className='usersdiv' style={{display:`${showusers}`,position:"fixed",height:"70%",borderRadius:"10px",zIndex:"10",backgroundColor:"white"}}>
        <small onClick={undisplayusers}  style={{cursor:"pointer",float:"right",fontSize:"20px",padding:"10px"}}>X</small>
        <div style={{overflow:"scroll",height:"100%"}}>
        <Users users={props.users} pendingconn={props.pendingconn} requestedconn={props.requestedconn} lastseen={props.lastseen} connects={props.connects} online={props.online}/>
        </div>
        </div>
<div className='container'>
 <div className='row'>
  <div className='col-4'></div>
  <div className='col-8'>
  <img src={`https://res.cloudinary.com/cloudinary-marketing/images/w_600,h_1169/c_scale,w_300,dpr_1.0/f_auto,q_auto/v1634828841/website_2021/guess_mobile_website/guess_mobile_website-png?_i=AA`} />
  </div>
 </div>
</div>
  
            <div style={{position:"absolute",marginTop:"40%",height:"700px",backgroundColor:"rgba(1,1,1,0.7)",width:"100%"}}>
                <div style={{margin:"2% 10%"}}>
                   <div className="row">
                       <div className='col-12 col-md-6'>
                       <div  style={{color:"white",margin:"10px",width:"100%",borderRadius:"10px",padding:"30px",backgroundColor:"#FF6347"}}>
                           <center>
                           <h4>Create Room <span className='fa fa-home'></span></h4>
                           <small style={{fotWeight:"bold"}}>  Create Rooms to bond with groups of people with same or like interests and personality.</small><br/>
                           <small></small>
                           </center>
                       </div>
                       </div>
                       <div className='col-12 col-md-6'>
                       <div  style={{color:"white",margin:"10px",width:"100%",borderRadius:"10px",padding:"30px",backgroundColor:"#FF6347",cursor:"pointer"}}>
                       <center>
                           <h4>Join Room <span className='fa fa-home'></span> + </h4>
                           <small tyle={{fotWeight:"bold"}}>  Select a room from the list of created rooms that fits your interest .</small><br/>
                           <small style={{color:"lightgray",fontStyle:"italic"}}> * Remember that a prompt would be sent to the Admin first</small>
                           <small></small>
                           </center>
                       </div>
                       </div>
                   </div>
                   <div className="row">
                       <div className='col-12 col-md-6'>
                       <div onClick={displayusers}  style={{color:"white",margin:"10px",width:"100%",borderRadius:"10px",padding:"30px",backgroundColor:"#FF6347",cursor:"pointer"}}>
                           <center>
                           <h4>Check Connections <span className='fa fa-link'></span></h4>
                           <small style={{fotWeight:"bold"}}>  Check Pending Messages and Open Connections.</small><br/>
                           <small></small>
                           </center>
                       </div>
                       </div>
                       <div className='col-12 col-md-6'>
                       <div  style={{color:"white",margin:"10px",width:"100%",borderRadius:"10px",padding:"30px",backgroundColor:"#FF6347",cursor:"pointer"}}>
                       <center>
                           <h4>Update Profile <span className='fa fa-edit'></span> </h4>
                           <small tyle={{fotWeight:"bold"}}> Edit Your Profile to help people find you and connect .</small>
                           <small></small>
                           </center>
                       </div>
                       </div>
                   </div>
                   <div style={{position:"relative"}}>
        <div style={{marginTop:"10%"}}>
          <div >
            <div className='row'>
              <div className='col-12 col-md-6' style={{backgroundColor:"rgba(0,0,0,0.4)"}}>
                <div style={{textAlign:"center", color:"white",justifyContent:"center",padding:"30px"}}>
                  <p style={{fontWeight:"bold",textAlign:"left",fontSize:"20px"}}>Welcome Dear User,</p>
                  <h4 style={{fontSize:"30px"}}>We are dedicated to making your loved one feel right at home!</h4>
                </div>
              </div>
              <div className='col-12 col-md-6' style={{backgroundColor:"#FF6347",borderRadius:"50%"}}>
                <div style={{color:"white",justifyContent:"center",padding:"30px"}}>
                 <div style={{display:"flex"}}>
                   <center >
                   <p style={{fontWeight:"bold",fontSize:"20px"}}> Contact Us <hr/></p>
                   <div style={{color:"black"}}>
                   <i><b>+234-81-693-194-76</b></i><br/>
                   <i><b>+234-81-693-194-76</b></i><br/>
                   <i><b>No 56 muritala mohammed way, oyingbo Yaba Lagos State.</b></i><br/>
                   </div>
                   </center>
                 </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{position:"absolute",zIndex:"3",left:"0",top:"70%",backgroundColor:"white",width:"30%",padding:"20px",border:"2px solid red",borderRadius:"50%",marginLeft:"5%"}}>
       <div style={{justifyContent:'center',textAlign:"center",color:"#FF6347"}}>
         <small style={{fontSize:"20px",fontWeight:"bold"}}>{props.userslength}+</small><br/>
         <small style={{fontSize:"20px",fontWeight:"bold"}}>users</small>
       </div>
        </div>
        </div>
                </div>
                <div style={{backgroundColor:"white",marginBottom:"10%"}}>
                <div style={{padding:"0 10%"}}>
            <div className='row'>
              <div className='col-12 col-md-6' style={{backgroundColor:"#FF6347",borderRadius:"50%"}}>
                <div style={{textAlign:"center", color:"white",justifyContent:"center",padding:"30px"}}>
                  <p>Welcome ----</p>
                  <h2 style={{fontSize:"20px"}}>We are dedicated to making your loved one feel right at home!</h2>
                </div>
              </div>
              <div className='col-12 col-md-6' style={{backgroundColor:"pink",backgroundImage:`url(${background})`,backgroundSize:"contain"}}>        
              </div>
            </div>
</div>

          <div style={{padding:"0 10%"}}>
            <div className='row'>
              <div className='col-6'>
                <div style={{padding:"35px"}}>
                  <h4 style={{color:"#FF6347",borderRadius:"50%"}}> Our Services </h4>
                  <button style={{backgroundColor:"#FF6347",borderRadius:"50%", border:"none",fontSize:"17px",color:"white",padding:"10px 18px",borderRadius:"3px"}}>
                     services -
                  </button>
                </div>
              </div>
              <div className='col-6' style={{backgroundColor:"pink",backgroundImage:`url(${background})`,backgroundSize:"contain"}}>        
              </div>
            </div>
          </div>
          <div style={{backgroundColor:"rgba(242,242,242,0.6)",padding:"50px"}}>
           <div className='container'>
            <div className='row'>
              <div className='col-6'>
                <img style={{width:"50%",padding:"30px"}} src={`http://localhost:5000/static/media/fruget.d6e6cf52.jpg`} />
                <div style={{padding:"10px"}}>
                 
                  <p style={{color:"grey",fontSize:"18px"}} >Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.
                   Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.<br/>
                   <button className='btn' style={{borderRadius:"100px",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}><small>LEARN MORE ...</small></button></p>
                </div>
              </div>
              <div className='col-6'>
                <img src={require('./hiring.jpeg')} />
                <div style={{padding:"10px"}}>
                 
                  <p style={{color:"grey",fontSize:"18px"}} >Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.
                   Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.<br/>
                   <button className='btn' style={{borderRadius:"100px",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}><small>LEARN MORE ...</small></button></p>
                </div>
              </div>
              <div className='col-4' style={{padding:"30px"}}>
                <img style={{width:"100%",height:"200px"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-t63kRHIHmCkrPH9xOAYCH6sd8hMqcm-08A&usqp=CAU`} />
                <h5 style={{color:"brown"}}>FIND FRIENDS NEARBY</h5>
                  <p style={{color:"grey",fontSize:"16px"}} >Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.</p>
              </div>
              <div className='col-4'>
                <img style={{width:"100%",height:"200px",borderRadius:"50px",padding:"30px"}} src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStKk1ruG4vgtPxdaR0Ohy-ruz1RJ5APLx9UQ&usqp=CAU`} />
                <h5 style={{color:"brown"}}>LOCKED END-END ENCRYPTED MESSAGES</h5>
                  <p style={{color:"grey",fontSize:"16px"}} >Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.</p>
              </div>
              <div className='col-12'>
                <div>
                  <p>Explore Our Services <span className='fa fa-chevron-right'></span></p>
                </div>
              </div>
            </div>
           </div>

           </div>
           <div className='container'>
            <div className='row'></div>
           </div>
           <div style={{backgroundColor:"rgb(0,0,0)",padding:"50px"}}>
           <div className='container'>
            <div className='row'>
            <div className='col-6' >
              <img src={`https://www.forefrontweb.com/wp-content/uploads/2021/09/003-MacBook-Space-Gray2.webp`} />
            </div>
            <div className='col-6' style={{color:"white"}}>
              <h3 style={{textTransform:"uppercase"}}>Conversion-Driven, Purpose-Grounded Website Design</h3>
              <p>
              What type of website do you need? A lead-generating machine, a beautiful eCommerce storefront or a simple 24/7 digital business card that you can use to aid your marketing efforts and establish crediblity?
<br/><br/>
No matter your need, ForeFront Web has the design creativity, development expertise and attention to detail to build your high performance website – think of us like the Mercedes-Benz of web design.<br/><br/>
<button className='btn' style={{borderRadius:"100px",backgroundColor:"indianred",color:"white",fontWeight:"bold",width:"80%"}}><small>REGISTER AND WIN TODAY</small></button>
              </p>
            </div>
           </div>
           </div>
           </div>
            <div className='container'>
            <div className='row'>
              <div className='col-6' style={{padding:"50px"}}>
                <img src={require('./lovephone.jpeg')} style={{width:"100%",borderRadius:"100px"}} />
              </div>
              <div className='col-6'>
                <div style={{padding:"50px",marginTop:"20%"}}>
                  <h2 style={{color:"brown"}}>CONNECT WIRELESSLY</h2>
                  <p style={{color:"grey",fontSize:"18px"}} >Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.</p>
                </div>
              </div>
            </div>
            </div>
            <div className='container'>
            <div className='row'>
              <div className='col-6'>
                <div style={{padding:"50px",marginTop:"20%"}}>
                  <h2 style={{color:"brown"}}>LOCKED END-END ENCRYPTED MESSAGES</h2>
                  <p style={{color:"grey",fontSize:"18px"}} >Being a member of this great family you can chat, send video clips and also engage in conversations without coming in contact<br/>
                   Hormels gives you that 24/7 access vibes with as low as 2 bytes of data, fast connect and optimized browsing system.</p>
                </div>
              </div>
              <div className='col-6' style={{padding:"50px"}}>
                <img src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ84uDhHB_uI1zIjS02RfcV-AC3GLkPU-zHeQ&usqp=CAU`} style={{width:"100%",borderRadius:"100px"}} />
              </div>
            </div>
            </div>

          <div style={{marginTop:"10%"}}>
          <div style={{padding:"0 10%"}}>
            <div className="row">
              <div className='col-12 col-md-4'>
                <div style={{padding:"30px"}}>
                  <img style={{borderRadius:"150px",width:"100%",height:"100%",padding:"20px"}} src={`https://media.istockphoto.com/photos/portrait-of-four-best-girlfriends-picture-id1041475534?`}></img>
                  <h2 style={{color:"brown"}}>LOCK GROUPS, PREVENT INTRUSION</h2>
                  <p style={{color:"grey",fontSize:"18px"}} >chat groups can be locked to prevent an outsider from intruding or joining. you could also set status to clearance so that incoming members would have to seek clearance from admin to join or view group details.</p>
                </div>
              </div>
              <div className='col-12 col-md-4'>
                <div style={{padding:"30px"}}>
                <img style={{borderRadius:"150px",width:"100%",padding:"20px"}} src={`https://media.istockphoto.com/photos/black-twin-sisters-walking-in-street-arm-in-arm-happily-picture-id1256333417`}></img>
                  <h2 style={{color:"brown"}}>NUTRITION & COMMUNICATION</h2>
                  <p style={{color:"grey",fontSize:"18px"}}>Nutritious home cooked meals and snacks with emphasis on hydration. Daily personal interaction to promote mindful thought.</p>
                </div>
              </div>
              <div className='col-12 col-md-4'>
                <div style={{padding:"30px"}}>
                <img style={{borderRadius:"150px",width:"100%",padding:"20px"}} src={`https://media.istockphoto.com/photos/diverse-friends-in-sportswear-laughing-together-in-a-gym-picture-id838379870?`}></img>
                  <h2 style={{color:"brown"}}>PHARMACY SUPPORT</h2>
                  <p style={{color:"grey",fontSize:"18px"}}>Medication and incontinence management Lensed Vocational Nurse available</p>
                </div>
              </div>
            </div>
           
            <hr/>
          </div>
        </div>
        </div>
            </div>
        </div>
        </div>
     );
}

export default Home;