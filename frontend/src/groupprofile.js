import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom"
import axios from 'axios';
import Cookies from 'js-cookie';

const CryptoJS = require("crypto-js")

function GroupProfile(props) {
    const [groupdetails, setgroupdetails] = useState({})
    const [userid, setuserid] = useState("")
    const [newImage, setnewImage] = useState([])
    const [groupmembers, setgroupmembers] = useState([])
    const params = useParams()

    useEffect(()=>{
        if(Cookies.get("cvyx")) {
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          setuserid(decryptedData)
      axios.get(`http://localhost:5000/fetch-groupinfo?groupid=${params.groupId}`)
      .then(res => {
        if(res.data.status === "success"){
            setgroupdetails(res.data.groupdetails)
            setgroupmembers(res.data.groupmembers)
        }
      })
      .catch(err => console.log("err",err))

    }
     },[])
    return (  
        <div>
              <div style={{backgroundColor:"lightgrey"}}>
        <div className='container'>
            <br/><br/><br/><br/>   
                   <div className='row' style={{padding:"5px",marginTop:"20px"}}>
                   <div className='d-none d-md-block col-md-2'></div>
                   <div className='col-12 col-md-4' style={{backgroundColor:"white",padding:"30px",borderLeftBottomRadius:"30px",borderLeftTopRadius:"30px",textAlign:"center"}}>
                    <center>
                      <div>
                        <p style={{color:"grey",fontWeight:"bold",fontSize:"15px"}}> "I am an advert expert with first class honours from the prestigious University of Lagos, complemented with a multi-national degree in Human resource and 
                          and project management.
                          I am open to learning new things and hope to strive and grow wherever i find myself, excellent team-playing with super-sonic work speed and honesty..."
                        </p>
                      </div>
                    </center>
                    <div style={{position:"relative"}}>
                   <div style={{position:"absolute",right:"0px",bottom:'0px'}}>
                    {parseInt(groupdetails.admin) === parseInt(userid) ?
           <label htmlFor='profileimage' style={{backgroundColor:"white",padding:"6px",borderRadius:"10px",border:"2px solid lightgrey"}}>
          <small style={{color:"orange",fontSize:"13px"}}> <span className='fa fa-camera fa-2x' style={{color:"orange"}}></span> Edit</small>
           </label>
           : null}
             </div>
                    <img style={{width:"100%",borderRadius:"50%",margin:"10px",height:"260px",boxShadow:"2px 2px 5px 3px lightgrey"}} src={groupdetails.image ? `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZGwJBI7Lc_HwIroVIGs9zWvHTUf9XK40STQ&usqp=CAU`:`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZGwJBI7Lc_HwIroVIGs9zWvHTUf9XK40STQ&usqp=CAU` } />
                    </div>
                  <div style={{display:"flex",padding:"0px",margin:"0"}}>
                    <div style={{width:"20%",padding:"0",margin:"0"}}>
                    <input type="file" style={{visibility:"hidden"}} name="profileimage" id="profileimage"  />
                    </div>
                    <div style={{width:"60%",padding:"0",margin:"0"}}>
                      <small className='upload-success' style={{color:"green",transition:"opacity 2s",fontWeight:"bold"}}> Image uploaded successfullly</small>
                      <small className='upload-failed' style={{color:"indianred",transition:"opacity 2s",fontWeight:"bold"}}> Image uploaded failed</small>
                    </div>
                    
                  </div>
            
         
           <br/><br/><br/>
                     <h3>{groupdetails && groupdetails.title}</h3><br/>
                                </div>

                   <div className='col-12 col-md-4' style={{backgroundColor:"white",padding:"30px",borderRightTopRadius:"30px"}}>
                 <div style={{textAlign:"center"}}>
                 <small style={{fontWeight:"bold",fontSize:"25px",textTransform:"uppercase"}}>{groupdetails && groupdetails.title}</small><br/>
                 <span style={{color:"grey",fontSize:"13px"}}>@{groupdetails && groupdetails.title}</span>
                 </div>
                  <div className='container-fluid' style={{marginTop:"15%", border:"2px solid lightgrey",padding:"2px", height:"300px",overflowY:"scroll"}}>
                  <p style={{fontSize:"15px",padding:"10px"}} className="mt-3 ">
                 <span style={{fontSize:"20px",padding:"3px",color:"lightgrey"}} className='fa fa-users  mr-2'></span>
                 <label for="backgroundimage">Members ({groupmembers.length})</label>
                  </p>
                 
                  {groupmembers && groupmembers.map(groupmember=>
                   <div className='row'  key={groupmember.userid}>
                   <div className='col-3' >
                   <img style={{borderRadius:"50%",width:"100%",height:"40px",border:"2px solid lightgrey",padding:"0px",marginLeft:"3px"}} src={groupmember.image ? `https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${groupmember.image}` : groupmember.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                   </div>
                   <div className='col-6 mt-2'>
                   <p style={{fontSize:"13px"}}>
                        {groupmember.name} {groupmember.userid == groupdetails.admin ?
                        <span className='fa fa-check' style={{border:"1px solid green",fontSize:"11px",color:"white",borderRadius:"50%",padding:"1px",backgroundColor:"red"}}></span> : null}
                        {props.online && props.online.includes(groupmember.userid) ?
                        <span style={{color:"#1E90FF"}} className="fa fa-circle ml-1"></span>
                        
                      : null}<br/>
                        <small>{"@" + groupmember.username}</small>
                    </p>
                   </div>
                   <div className='col-3 mt-2'>
                    {groupmember.userid !== parseInt(userid) ?
                  <a href={`/chat/${groupmember.userid}?display=messages`}>
                  <button className='btn btn-primary' style={{padding:"2px"}}>
                     <small>MESSAGE</small>
                   </button>
                  </a> : null}
                   </div>
                   </div>
                   )}
                  </div>
                  {groupdetails.members && !JSON.parse(groupdetails.members).includes(parseInt(userid)) ? null :
                  <div style={{marginTop:"30%"}}>
                <a href={`/chat/group/${groupdetails.groupId}?display=messages`}> 
                 <button className='btn btn-primary' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <p> Message Group</p>
                    </button></a><br/><br/>
               
                    <button className='btn btn-danger' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <p> Exit Group </p>
                    </button>
                  </div>
                  }
                  <br/><br/>
                  <div className='row mt-5'>
                    <div className='col-12' style={{borderRadius:"20px",border:"2px solid lightgrey",width:"100%"}}>
                   <p style={{fontSize:"15px",padding:"10px",borderBottom:"1px solid grey"}} className="mt-3 "><span style={{fontSize:"20px"}} className='fa fa-picture-o text-primary mr-2'></span> Media, Docx and Links <span style={{float:"right"}}> ~ 2</span></p>
                   {parseInt(groupdetails.admin) === parseInt(userid) ?
                  <p style={{fontSize:"15px",padding:"10px",borderBottom:"1px solid grey"}} className="mt-3 ">
                 <span style={{fontSize:"20px",border:"1px solid grey",padding:"3px",color:"indianred"}} className='fa fa-star-o  mr-2'></span>
                 <label for="backgroundimage">Wallpaper </label>
                 <i style={{float:"right"}}></i>
                  </p>
                 : null}
                   <input type="file" style={{display:"none"}}  id="backgroundimage"></input>
                   <p style={{fontSize:"15px",padding:"10px"}} className="mt-3 "><span style={{fontSize:"20px",border:"1px solid grey",padding:"5px",borderRadius:"20px"}} className='fa fa-users text-primary mr-2'></span> Groups in Common <span style={{float:"right"}}> ~ </span></p>

                    </div>
                  </div>
                  <br/><br/><br/>
                  <div style={{position:"absolute", bottom:"10px"}}>
                    <center><p style={{color:"grey",fontSize:"13px"}}>created <br/><b style={{color:"black"}}> 20/10/2013</b></p></center>
                  </div>
                   </div>
                   <div className='d-none d-md-block col-md-2'></div>
                   </div>
                </div>
                </div>
        </div>
    );
}

export default GroupProfile;