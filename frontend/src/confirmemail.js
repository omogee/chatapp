import React, { useState, useEffect } from 'react';
import axios from "axios"
import {useParams} from "react-router-dom"


function ConfirmEmail() { 
    const [loading, setloading] = useState("pending")
    const params = useParams()
    
    useEffect(()=>{
        const confirmationId = parseInt(params.confirmationId.split("-")[3])
        if(confirmationId && confirmationId.toString().length === 6){
        axios.get(`http://localhost:5000/confirm_email?confirmationId=${confirmationId}&email=${params.email}`)
        .then(res =>{
           if(res.data.status === "success"){
            setloading("success")
            setTimeout(()=>{
                window.location.href="/"
            },2000)
           }else{
            setloading("failed")
            setTimeout(()=>{
                window.location.href="/register"
            },3000)
           }
        })
        .catch(err => console.log(err))
    }
       console.log(parseInt(params.confirmationId.split("-")[3]),confirmationId.toString().length)
    })
    return ( 
        <div>
            <center>
                {loading === "pending" ?
           <div>
             <img style={{width:"10%",marginTop:"10%"}} src={`https://i.gifer.com/origin/b4/b4d657e7ef262b88eb5f7ac021edda87.gif`} />
            <br/><br/>
           <div style={{fontSize:"17px"}}>
           <p>Confirming <a href="">{params.email || "Email"}</a></p><br/><br/>
           <small>This Should Only take a few seconds...</small>
           </div>
           </div>
           : loading === "success" ?
          <div>
             <span style={{marginTop:"10%",fontSize:"100px"}} className='fa fa-check text-success fa-3x'></span>
            <br/><br/>
           <div style={{fontSize:"17px"}}>
           <p><a href="">{params.email || "Email"}</a> Confirmed Successfully</p><br/><br/>
           <small>You Would be redirected to the home page in 3 seconds</small>
          </div>
          </div>
          : 
          loading === "failed" ?
          <div>
             <span style={{marginTop:"10%",fontSize:"100px"}} className='fa fa-times text-danger fa-3x'></span>
            <br/><br/>
           <div style={{fontSize:"17px"}}>
           <p><a href="">{params.email || "Email"}</a> Confirmation Failed</p><br/><br/>
           <small>This Email cannot be confirmed</small><br/>
           <p>Kindly try again after few minutes or use another email address</p>
          </div>
          </div>
          : null
           }
            </center>
          
        </div>
     );
}

export default ConfirmEmail;