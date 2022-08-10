import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useParams} from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import "./main.css"
import { formatlastSeen,formatermain } from './formatTime';

const CryptoJS = require("crypto-js")

function Profile() {
    const [user,setuser] = useState({})
    const [users, setusers] = useState([ ])
    const [userid, setuserid] = useState("")
    const [otheruser, setotheruser] = useState("")
    const [redirect,setredirect] =useState(false)
    const [newImage, setnewImage] =useState("")
    const [file, setfile] = useState({})
    const [fullprofile, setfullprofile] = useState([])
    const [tempolikes, settempolikes] = useState({})
    const [uploadbtn,setuploadbtn] = useState("none")


    const params = useParams()
    useEffect(()=>{
        if(Cookies.get("cvyx") && params.userId && params.userId !== null){
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
           setuserid(decryptedData)
       axios.get(`http://localhost:5000/fetch-userprofile?id=${parseInt(params.userId)}`)
       .then(res => {
           if(res.data.length === 0 || !res.data){
          setredirect(true)
           }else{
               console.log(res.data)
               setuser(res.data[0])
               setfullprofile(res.data)
           }
       })
       .catch(err => console.warn(err))
        }
        },[params])
      const  filechange=(e)=>{
        const filereader = new FileReader()
        filereader.onload = event =>{
          setnewImage(filereader.result)
        }
        filereader.readAsDataURL(e.target.files[0]);
        setfile(e.target.files[0])
         setuploadbtn("block")
        }
        const changeImage=()=>{
          if(parseInt(params.userId) === parseInt(userid)){       
          const formdata = new FormData()
          formdata.append("id", userid)
          formdata.append("files",file)
          axios.post("http://localhost:5000/change-profilepic", formdata)
          .then(res => {
            if(res.data.status === "success"){
              setuploadbtn("none")
            }
          })
          .catch(err => console.log(err))
        }  
        }
         const follow =(otheruser)=>{
          axios.get(`http://localhost:5000/follow-user?mainuser=${userid}&&otheruser=${params.userId}`)
          .then(res => console.log(res.data))
          .catch(err => console.log(err))
         }
        const like =(uploadid)=>{
          if(Cookies.get("cvyx") ){ 
              var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          axios.get(`http://localhost:5000/like-post?uploadid=${uploadid}&&id=${decryptedData}`)
          .then(res =>  settempolikes({...tempolikes, [`${uploadid}`]:res.data.likes}))
          .catch(err => console.log(err))
          }
      }
    return (
        <div >
        <div style={{width:"100%",backgroundColor:"white"}}></div>
        <div className='container' >
            <br/><br/><br/><br/>
                   <div className='row'>
                   <div className='d-none d-md-block col-md-2'></div>
                   <div className='col-12 col-md-4' style={{backgroundColor:"white",padding:"30px",boxShadow:"2px 2px 3px 3px lightgrey",borderRadius:"30px",textAlign:"center"}}>
                   <div style={{position:"absolute",right:"20%",top:'50px'}}>
                    {parseInt(params.userId) === parseInt(userid) ?
           <label htmlFor='profileimage'>
           <span className='fa fa-pencil-square fa-2x' style={{color:"orange"}}></span>
           </label>
           : null}
             </div>
                    <img style={{width:"100%",borderRadius:"50%",padding:"20px",height:"250px",boxShadow:"2px 2px 5px 3px lightgrey"}} src={newImage.length > 0 ? newImage : user.image ? `https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${user.image}` : user && user.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                  <div style={{display:"flex",padding:"0px",margin:"0"}}>
                    <div style={{width:"80%",padding:"0",margin:"0"}}>
                    <input type="file" style={{visibility:"hidden"}} name="profileimage" id="profileimage" onChange={filechange} />
                    </div>
                    <div style={{width:"20%"}}>
                      <button style={{display:`${uploadbtn}`}} onClick={changeImage} className='btn btn-primary'>Upload</button>
                    </div>
                  </div>
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
                   <div className='col-12 col-md-4' style={{backgroundColor:"white",padding:"30px",boxShadow:"2px 2px 3px 3px lightgrey",borderRadius:"30px"}}>
                 <div style={{textAlign:"center"}}>
                 <small style={{fontWeight:"bold",fontSize:"25px"}}>{user && user.name}</small><br/>
                 <small style={{color:"grey"}}>@{user && user.username}</small>
                 </div>
                  <div className='row' style={{marginTop:"15%"}}>
                    <div className='col-4' style={{textAlign:"center"}}>
                        <h1 style={{color:"grey"}}>{user.following && JSON.parse(user.following).length}</h1>
                        <p style={{color:"grey"}}>Following</p>
                    </div>
                    <div className='col-4' style={{textAlign:"center"}}>
                    <h1 style={{color:"grey"}}>{user.followers && JSON.parse(user.followers).length}</h1>
                        <p style={{color:"grey"}}>Followers</p>
                    </div>
                    <div className='col-4' style={{textAlign:"center"}}>
                    <h1 style={{color:"grey"}}>{fullprofile.length}</h1>
                        <p style={{color:"grey"}}>Posts</p>
                    </div>
                  </div>
                  <div style={{marginTop:"15%"}}>
                <a href={`/chat/${user.userid}`}> 
                 <button className='btn btn-primary' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <small> Message </small>
                    </button></a><br/><br/>
                    <button className={user.followers && JSON.parse(user.followers).includes(parseInt(userid)) ? 'btn btn-warning' : 'btn btn-success'} onClick={()=>follow(user.userid)} style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <small>{user.followers && JSON.parse(user.followers).includes(parseInt(userid)) ? "Unfollow" : "Follow"} </small>
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
        <div style={{position:"fixed",color:"white",padding:"2px 10px",borderRadius:"20px",zIndex:"10",backgroundColor:"indianred",bottom:"10px",right:"10px"}}>
     <p> <span className='fa fa-upload fa-2x' ></span> Upload</p>
        </div>
         <div className='container contain' style={{marginTop:"30px"}}>
           {fullprofile.length > 0 ? fullprofile.map(upload =>
           <div style={{backgroundColor:"white",marginBottom:"10px",borderRadius:"10px",padding:"10px",border:"1px solid lightgrey"}} key={upload.uploadid}>
            <div style={{display:"flex",width:"100%",flexWrap:"nowrap"}}>
                <div style={{width:"11%",padding:"5px"}}>
                    <img src={`https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${user.image}`} style={{width:"100%",borderRadius:"50%",border:"1px solid grey",height:"50px"}}/>
                </div>
                <div style={{width:"70%"}}>
                  <a href={`/profile/${upload.userid}`} style={{textDecoration:"none"}}> <small style={{fontWeight:"bold",color:"black"}}>{user.name}</small></a><br/>
                   <small style={{color:"grey"}}> @{user.username}. {formatermain(upload.time)}</small>
                </div>
            </div>
            <div style={{width:"100%"}}>
                <p>{upload.caption}</p>
                <small></small>
             </div>
            
             <div className='row' style={{padding:"2px 15px"}}>            
                {upload.imgs && JSON.parse(upload.imgs) ? 
              JSON.parse(upload.imgs).map(img =>
                <div style={{margin:"0",padding:"0"}} className={`${upload.imgs && JSON.parse(upload.imgs).length === 1 ?`col-12` : upload.imgs && JSON.parse(upload.imgs).length === 3 ? `col-6` : `col-6`}`}>
               <img style={{width:"100%",height:`${upload.imgs && JSON.parse(upload.imgs).length > 1 ? "300px" : "500px"}`,padding:"2px",borderRadius:"3px"}} className="uploadedimage" data-src={`https://i.pinimg.com/originals/4f/43/2d/4f432d9234988a5f33b26e0ba06bc6fe.gif`} src={`https://res.cloudinary.com/fruget-com/image/upload/v1659901491/chatapp/uploads/${img}`}/>
                </div>
                  )
           : null}
        
                </div>
                <div style={{display:"flex",width:"100%", justifyContent:"space-between"}}>
                    <div className='ml-3' style={{width:"20%",padding:"5px"}}>
                        <span className={tempolikes[`${upload.uploadid}`] && tempolikes[`${upload.uploadid}`].includes(parseInt(userid)) ? 'fa fa-thumbs-up text-primary' : upload.likes && JSON.parse(upload.likes).includes(parseInt(userid)) ? 'fa fa-thumbs-up text-primary' : 'fa fa-thumbs-o-up text-primary'} onClick={()=>like(upload.uploadid)} style={{fontSize:"20px"}}></span>
                         <small style={{fontSize:"18px"}} className={tempolikes[`${upload.uploadid}`] && tempolikes[`${upload.uploadid}`].includes(parseInt(userid)) ? "text-primary ml-1" :upload.likes && JSON.parse(upload.likes).includes(parseInt(userid)) ? "text-primary ml-1" : "text-muted ml-1"}>{tempolikes[`${upload.uploadid}`] && tempolikes[`${upload.uploadid}`].length || upload.likes && JSON.parse(upload.likes).length}</small>
                    </div>
                    <div style={{width:"20%"}}>
                    <span className='ml-3 fa fa-comment-o' style={{fontSize:"20px",color:"red"}}></span> <small style={{fontSize:"18px"}}>{upload.likes && JSON.parse(upload.likes).length}</small>
                    </div>
                
             </div>
           </div>
           
            ) : 
            <div style={{backgroundColor:"white",width:"100%"}}>
            <center>
                <h1>No Uploads On Your Feed</h1></center>
                </div>}

        </div>
                </div>
     );
}

export default Profile;