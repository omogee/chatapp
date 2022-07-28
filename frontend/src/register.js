import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import background from "./homewallpaper.jpeg"
import "./main.css"
import axios from "axios"


function Register() {
    const [displayforms, setDisplayforms]=useState("")
    const [success, setsuccess]=useState("none")
    const [failure, setfailure]=useState("none")
    const [inputs,setInputs] = useState({
        name:"",username:"",email:"",contact:"",gender:"",password:""
    })
const change=(e)=>{
    setInputs(prev => ({...prev, [e.target.name]:e.target.value}))
}
const register =()=>{
    axios.post(`https://realchatapps.herokuapp.com/user/register`,{data:JSON.stringify(inputs)},
    {
        headers: {
          'Content-Type': 'application/json'
        },
   //      withCredentials: true 
         })
    .then(res => {
        if(res.data.message === "success"){
            setDisplayforms("none")
         setsuccess("")
        }else{
            setDisplayforms("none")
            setfailure("")
        }
    })
    .catch(err => console.warn(err))
}
    return ( 
        <div>
        <div style={{height:"49%",width:"50%",position:"fixed",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundImage:`url(${background})`}}>
        </div>
        <div style={{height:"49%",width:"49%",position:"fixed",left:"51%",backgroundColor:"#FF6347"}}>
        </div>
        <div style={{height:"49%",width:"50%",position:"fixed",top:"50%",backgroundColor:"#FF6347"}}>
        </div>
        <div style={{height:"49%",left:"51%",width:"49%",top:"50%",position:"fixed",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundImage:`url(${background})`}}>
        </div>
        <div className='row'  >
              <div className='col-1 col-md-3 col-lg-4'></div>
              <div className='col-10 col-md-6 col-lg-4' style={{padding:"20px",marginTop:"2%"}}>
                  <div style={{backgroundColor:"rgba(255,255,255,0.9)",boxShadow:"2px 2px 3px 3px lightgrey",padding:"20px",borderRadius:"5px"}}>
                  <div style={{width:"100%"}}>
                   <div style={{textAlign:"center"}}>
                       <h4 className="title">
                           <span>REGISTER</span>
                       </h4>
                       <small style={{color:"#FF6347",fontWeight:"bold"}}>Chatveille</small>
                   </div>
                   <div style={{display:`${success}`}}>
                       <center style={{fontFamily:"FontAwesome"}}>
                       <span style={{color:"green",fontSize:"150px"}}> &#xf058;</span>
                           <h1>Registration Recieved Successfully!!!</h1>
                       </center>
                   </div>
                   <div style={{display:`${failure}`}}>
                       <center style={{fontFamily:"FontAwesome"}}>
                       <span style={{color:"red",fontSize:"150px"}}> &#xf05e;</span>
                           <h1>Opps Registration Failled!!!</h1>
                       </center>
                   </div>
                   <div style={{display:`${displayforms}`}}>
                       <br/>
                       <input type="text" onChange={change}  name="name" placeholder="&#xf007; Full Name" style={{fontFamily: "FontAwesome"}} className='form-control'></input>
                     <br/>
                     <input type="text" onChange={change} name="username" placeholder="@" style={{fontFamily: "FontAwesome"}} className='form-control'></input>
                     <br/>
                       <input type="text" onChange={change} name="email" placeholder='&#xf0e0; Email Address' style={{fontFamily: "FontAwesome"}} className='form-control'></input>
                     <br/>
                       <input type="text" onChange={change} name="contact" placeholder='&#xf095; Phone No' style={{fontFamily: "FontAwesome"}} className='form-control'></input>
                     <br/> <input type="text" onChange={change} name="gender" placeholder='Gender' style={{fontFamily: "FontAwesome"}} className='form-control'></input>
                     <br/> <input type="password" onChange={change} name="password" placeholder='&#xf023; Password' style={{fontFamily: "FontAwesome"}} className='form-control'></input>
                     <br/>
                     <button className='btn btn-sm' onClick={register} style={{backgroundColor:"#FF6347",color:"white",fontWeight:"bold",width:"100%"}}>
                           REGISTER
                       </button>

                       <div style={{marginTop:"30px",fontSize:"18px"}}>
                           <center>
                               <small>Already A Registered User</small><br/>
                               <small> Click <Link to={`/login`}>Here</Link> To Login</small>
                           </center>
                       </div>
                        </div>
                       </div>
                  </div>
              </div>
              </div>

        </div>
     );
}

export default Register;