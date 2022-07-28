import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useParams} from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import { formatlastSeen } from './formatTime';

const CryptoJS = require("crypto-js")

function Profile() {
    const [user,setuser] = useState({})
    const [users, setusers] = useState([ ])
    const [redirect,setredirect] =useState(false)
    const params = useParams()
    useEffect(()=>{
        if(Cookies.get("cvyx") && params.userId && params.userId !== null){
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      
       axios.get(`https://realchatapps.herokuapp.com//fetch-user?inboxuserId=${params.userId}&&mainuserId=${decryptedData}`)
       .then(res => {
           if(res.data.length === 0 || !res.data){
          setredirect(true)
           }else{
            console.log(user)
               setuser(res.data[0])
           }
       })
       .catch(err => console.warn(err))
        }
        },[params])
    return (
        <div >
        <div style={{position:"fixed",height:"100%",width:"100%",backgroundColor:"black"}}></div>
        <div className='container' >
            <br/><br/><br/><br/>
                   <div className='row'>
                   <div className='col-2'></div>
                   <div className='col-4' style={{backgroundColor:"white",height:"80vh",padding:"30px",boxShadow:"2px 2px 3px 3px lightgrey",borderRadius:"30px",textAlign:"center"}}>
                    <img style={{width:"80%",borderRadius:"50%",padding:"20px",height:"250px",boxShadow:"2px 2px 5px 3px lightgrey"}} src={user && user.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                    <br/><br/>
                     <p>{user && user.name}</p>
                  <p>{user.contact}</p>
                  <p>{user.email}</p>
                  <p>{user.lastseen}</p>
                    <button className='btn btn-primary' style={{borderRadius:"100px",fontWeight:"bold",textTransform:"uppercase",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}>
            <span className='fa fa-phone'> Call </span>
          </button>
          <div style={{position:"absolute",width:"100%",bottom:"3px"}}>
            <center>
              {formatlastSeen(user && user.lastseen)}
            </center>
          </div>
                   </div>
                   <div className='col-4' style={{backgroundColor:"white",padding:"30px",boxShadow:"2px 2px 3px 3px lightgrey",borderRadius:"30px"}}>
                 <div style={{textAlign:"center"}}>
                 <small style={{fontWeight:"bold",fontSize:"25px"}}>{user && user.name}</small><br/>
                 <small style={{color:"grey"}}>@{user && user.username}</small>
                 </div>
                  <div className='row' style={{marginTop:"15%"}}>
                    <div className='col-4' style={{textAlign:"center"}}>
                        <h1>0</h1>
                        <p style={{color:"grey"}}>Following</p>
                    </div>
                    <div className='col-4' style={{textAlign:"center"}}>
                    <h1>0</h1>
                        <p style={{color:"grey"}}>Followers</p>
                    </div>
                    <div className='col-4' style={{textAlign:"center"}}>
                    <h1>0</h1>
                        <p style={{color:"grey"}}>Posts</p>
                    </div>
                  </div>
                  <div style={{marginTop:"15%"}}>
                <a href={`/chat/${user.userid}`}> 
                 <button className='btn btn-primary' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <small> Message </small>
                    </button></a><br/><br/>
                    <button className='btn btn-success' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <small> Follow </small>
                    </button><br/><br/>
                    <button className='btn btn-danger' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <small> Delete User </small>
                    </button>
                  </div>
                  <div style={{position:"absolute",bottom:"5px"}}>
                    <center><p style={{color:"grey",fontSize:"15px"}}>Joined Sept 2013</p></center>
                  </div>
                   </div>
                   <div className='col-2'></div>
                   </div>
                </div>
                </div>
     );
}

export default Profile;