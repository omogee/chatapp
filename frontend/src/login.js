import React, { useState, useEffect } from 'react';
import "./main.css"
import background from "./homewallpaper.jpeg"
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from "js-cookie"
import {useNavigate} from "react-router-dom"
import socket from "./socketconn"

const CryptoJS = require("crypto-js")

function Login(props) {
    
    const [input,setinput] = useState({})
    const [loginmessage,setloginmessage] =useState("")
    let navigate = useNavigate()
    const change =(e)=>{
      setinput(prev => ({...prev, [e.target.name]:e.target.value}))
    }
    const login =()=>{
        axios.get(`https://realchatapps.herokuapp.com/user/login?name=${input.username}&password=${input.password}`)
        .then(res => {
             if(Cookies.get("cvyx")){
                 var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

                    socket.emit("removeUser", parseInt(decryptedData))
                }
            if(res.data.message === "failed"){
              setloginmessage(res.data.reason)
            }else{
                setloginmessage("login successful")
               
                  var cipherusermain = CryptoJS.AES.encrypt(JSON.stringify(res.data.user), 'my-secret-key@123').toString();
                  var cipheridmain = CryptoJS.AES.encrypt(JSON.stringify(res.data.user[0].userid), 'my-secret-key@123').toString();

    Cookies.set("cvyx", `${cipheridmain}`, { expires: 0.3555 })
  socket.emit("addUser", parseInt(res.data.user[0].userid))
               setTimeout(() => {
                   if(props.previouspage){
                       window.location.assign(props.previouspage)
                   }else{
                       window.location.assign(`/`)
                   }
                }, 1000);
            
            }
        })
        .catch(err => console.warn(err))
    }
    return ( 
        <div>
             <div style={{height:"100%",width:"100%",position:"fixed",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundImage:`url(${background})`}}>
        </div>
        
        <div className="container">
            <br/><br/><br/><br/><br/><br/><br/>
          <div className='row' >
              <div className='col-1 col-md-3 col-lg-4'></div>
              <div className='col-10 col-md-6 col-lg-4' style={{backgroundColor:"rgba(255,255,255,0.8)",padding:"20px"}}>
                  <div style={{width:"100%"}}>
                   <div style={{textAlign:"center"}}>
                       <h4 className="title">LOGIN</h4>
                       <p style={{color:`${loginmessage === "login successful" ? "green" : "red"}`,fontWeight:"bold"}}>{loginmessage}</p>
                   </div>
                   <div>
                       <br/>
                       <input onChange={change} type="text" name="username" placeholder='&#xf007; Email/Username' style={{fontFamily:"FontAwesome"}} className='form-control'></input>
                       <br/>
                       <br/>
                       <input onChange={change} type="password" name="password" placeholder='&#xf023; Password' style={{fontFamily:"FontAwesome"}} className='form-control' ></input>
                      
                       <small style={{float:"right",cursor:"pointer",fontSize:"14px",color:"grey"}}>Forgot Password?</small>
                       <br/>
                       <br/>
                       <button className='btn btn-sm' onClick={login} style={{backgroundColor:"#FF6347",color:"white",fontWeight:"bold",width:"100%"}}>
                           LOGIN
                       </button>
                       <div style={{marginTop:"60px",fontSize:"18px"}}>
                           <center>
                               <small>Not Yet a Registered User</small><br/>
                               <small> Click <Link to={`/register`}>Here</Link> To Register</small>
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

export default Login;