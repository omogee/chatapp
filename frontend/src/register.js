import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import background from "./homewallpaper.jpeg"
import "./main.css"
import axios from "axios"


function Register() {
    const [displayforms, setDisplayforms]=useState("")
    const [success, setsuccess]=useState("none")
    const [message, setmessage]= useState("")
    const [failure, setfailure]=useState("none")
    const [inputs,setInputs] = useState({})
const change=(e)=>{
    setInputs(prev => ({...prev, [e.target.name]:e.target.value}))
}
const register =()=>{
    const formdata = new FormData()
    formdata.append("inputs",JSON.stringify(inputs))
    console.log("inputs",inputs)
    formdata.append("files", inputs.file)
    console.log("inputs",formdata.get('inputs'))
    console.log("files", formdata.get("files"))
    axios.post(`http://localhost:5000/user/register`,formdata,
    {
        headers: {
          'Content-Type': 'application/json'
        },
   //      withCredentials: true 
         })
    .then(res => {
        if(res.data.status === "success"){
            setDisplayforms("none")
         setsuccess("")
        }else  if(res.data.status === "failed"){
          setmessage(res.data.message)
          setfailure("")
       
        }
    })
    .catch(err => console.warn(err))
}
const Filechange=(e)=>{
    setInputs(prev =>({...prev, file:e.target.files[0]}))
    const reader = new FileReader()
    reader.onload = e =>{
        let imgprev = document.querySelector(".imagedisplay")
        imgprev.src = reader.result
    }
    reader.readAsDataURL(e.target.files[0])
}
    return ( 
        <div className='container'>
        <div style={{height:"49%",width:"50%",position:"fixed",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundImage:`url(${background})`}}>
        </div>
        <div style={{height:"49%",width:"49%",position:"fixed",left:"51%",backgroundColor:"#FF6347"}}>
        </div>
        <div style={{height:"49%",width:"50%",position:"fixed",top:"50%",backgroundColor:"#FF6347"}}>
        </div>
        <div style={{height:"49%",left:"51%",width:"49%",top:"50%",position:"fixed",backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundImage:`url(${background})`}}>
        </div>
        <br/><br/><br/><br/><br/>
        <div className='row'  >
              <div className='d-none d-md-block col-md-3 col-lg-3'></div>
              <div className='col-12 col-md-6 col-lg-6' style={{padding:"20px"}}>
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
                           <p><a href="/" >Click Here</a> to access the Home Page</p>
                       </center>
                   </div>
                
                   <div style={{display:`${displayforms}`}}>
                   <div className="failure" style={{display:`${failure}`}}>
                       <center style={{fontFamily:"FontAwesome"}}>
                       <span style={{color:"red",fontSize:"30px"}}> &#xf05e;</span>
                           <p>Opps Registration Failled!!!</p>
                           <p style={{color:"red"}}>{message}</p>
                       </center>
                   </div>
                    <br/>
                    <center>
                    <div style={{width:"80%"}}>
                        <label for="fileinput">
                        <img style={{width:"100%",height:"200px"}} className="imagedisplay" src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFguokLDkdb7t5QN9W8seqUgFMgCbmM1Om_Q&usqp=CAU`}></img>
                   </label>
                    </div>
                    </center>
                    <input type="file" id="fileinput" style={{visibility:"hidden"}} onChange={Filechange} className='form-control' />
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