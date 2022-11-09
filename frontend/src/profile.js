import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {useParams, Navigate} from "react-router-dom"
import axios from "axios"
import Cookies from "js-cookie"
import "./main.css"
import { formatlastSeen,formatermain } from './formatTime';
import Login from './login';

const CryptoJS = require("crypto-js")

function Profile(props) {
    const [user,setuser] = useState({})
    const [users, setusers] = useState([ ])
    const [userid, setuserid] = useState("")
    const [otheruser, setotheruser] = useState("")
    const [redirect,setredirect] =useState(false)
    const [newImage, setnewImage] =useState("")
    const [file, setfile] = useState({})
    const [fullprofile, setfullprofile] = useState([])
    const [tempolikes, settempolikes] = useState({})
    const [tempofollowers, settempofollowers] = useState(null)
    const [successmsg, setsuccessmsg] = useState("0")
    const [failuremsg, setfailuremsg] = useState("0")
    const [uploadbtn,setuploadbtn] = useState("none")
    const [display, setdisplay ] = useState("none")
    const [commongroups, setcommongroups] = useState([])
    const [newbackgroundimage, setnewbackgroundimage] = useState(null)
    const  [images, setimages] = useState([])
  //  const [tempolikes, settempolikes] = useState({})
    const [files, setfiles] = useState([])
    const [caption, setcaption] = useState("")
    const [uploadmessage, setuploadmessage] = useState("")
    const [uploadstatuscolor, setuploadstatuscolor] = useState("green")


    const params = useParams()
    useEffect(()=>{
        if(Cookies.get("cvyx") && params.userId && params.userId !== null){
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      if(!decryptedData || decryptedData === null ){
        setredirect(true)
      }
           setuserid(decryptedData)
       axios.get(`http://localhost:5000/fetch-userprofile?id=${parseInt(params.userId)}&ownerid=${decryptedData}`)
       .then(res => {
           if(res.data.status === "failed" || (res.data.users.length === 0 || !res.data.users)){
          setredirect(true)
           }else{
               setuser(res.data.users[0])
               setfullprofile(res.data.users)
               setcommongroups(res.data.commongroups)
           }
       })
       .catch(err => console.warn(err))
        }else{
          setredirect(true)
        }
        },[params.userId])
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
              setsuccessmsg("1")
              setTimeout(()=>{
               setsuccessmsg("0")
              }, 3000)
              setuploadbtn("none")
            }else{
              setfailuremsg("1")
              setTimeout(()=>{
                setfailuremsg("0")
               }, 3000)
            }
          })
          .catch(err => console.log(err))
        }  
        }
         const follow =(otheruser)=>{
          axios.get(`http://localhost:5000/follow-user?mainuser=${userid}&&otheruser=${params.userId}`)
          .then(res => {
            if(res.data.status === "success"){
              settempofollowers(res.data.followers)
              console.log("tempofollowers",tempofollowers)
              }
          })
          .catch(err => console.log(err))
         }
        const like =(uploadid)=>{
          if(Cookies.get("cvyx") ){ 
              var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          axios.get(`http://localhost:5000/like-post?uploadid=${uploadid}&&id=${decryptedData}`)
          .then(res =>  {
            settempolikes({...tempolikes, [`${uploadid}`]:res.data.likes})
            
          })
          .catch(err => console.log(err))
          }
      }
      const uploadpost =()=>{
    
        if(Cookies.get("cvyx") ){ 
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        const formdata = new FormData()
        formdata.append("caption",caption)
        formdata.append("id", decryptedData)
        files.map(img =>{
            formdata.append("files",img)
        })
        axios.post(`http://localhost:5000/upload-post`, formdata)
        .then( res => {
          if(res.data.status === "success"){
            setuploadmessage("Post Uploaded Successfully")
            setfiles([])
            setimages([])
            setcaption("")
            setTimeout(()=>{
                setuploadstatuscolor("green")
                setuploadmessage("")
            //    setdisplay("none")
            },2000)
        }else{ 
            setuploadstatuscolor("red")
            setuploadmessage(res.data.message)
        }
        })
        .catch(err => console.log(err))
    }
    }
    const upload =()=>{
        window.scrollTo(0,0)
         setdisplay(display === "block" ? "none" : "block")
    }
    const removeImage=(img,index)=>{
      setimages(images.filter(prev => prev !== img))
      setfiles(files.filter((prev,i)=> i !== index))
    }
    const  filechange2=(e)=>{
      if(images.length <= 3){
         setfiles(prev =>([...prev, e.target.files[0]]))
       const reader = new FileReader()
       reader.onload = e =>{
      //   let imgprev = document.querySelector(".imagedisplay")
        // imgprev.src = reader.result
        setimages(prev => ([...prev, reader.result]))
     }
       reader.readAsDataURL(e.target.files[0])
 }else{
     alert("maximum images for uploads is 4")
 }
     }
    const change=(e)=>{
         setcaption(e.target.value)
     }
      const backgroundImageChange =(e)=>{
        console.log(e.target.files[0])
      const formdata = new FormData()
      formdata.append("files", e.target.files[0])
      formdata.append("id", userid)
      axios.post(`http://localhost:5000/change-backgroundimage`, formdata)
        .then( res => {
          if(res.data.status === "success"){
            setnewbackgroundimage(e.target.files[0].name)
          }
        })
        .catch(err => console.log(err))
      }
      if(redirect){
        return(
         <Navigate to="/login" state="hello"/>
        )
      }else{
    return (
        <div style={{backgroundColor:"lightgrey"}}>
        <div className='container'>
            <br/><br/><br/><br/>
            <div className='row mt-3' style={{display:`${display}`}}>
              <div className='d-none d-md-block col-md-3'></div>
            <div className='col-12 col-md-6'>
                <br/>
            <div  style={{position:"relative",backgroundColor:"white",marginBottom:"10px",padding:"20px",borderRadius:"20px"}}>
             <div style={{position:"absolute",right:"5px",top:'5px'}}>
              <span className='fa fa-times text-muted' onClick={()=>  setdisplay("none")} style={{cursor:"pointer",fontSize:"30px",fontWeight:"lighter"}}></span>
             </div>
             <p style={{textAlign:"center",color:`${uploadstatuscolor}`,fontStyle:"italic",fontWeight:"bold"}}>{uploadmessage}</p>
             <div style={{display:"flex",flexWrap:"wrap"}}>
                {images.length > 0 ? images.map((img,index) => 
                <div style={{width:"45%",position:"relative",padding:"3px"}}>
                <div style={{position:"absolute",right:"2px",top:'2px'}}>
              <span className='fa fa-times text-danger' onClick={()=>removeImage(img,index)} style={{fontSize:"20px"}}></span>
             </div>
                    <img src={img} style={{padding:"5px",border:"1px solid lightgrey",borderRadius:"10px",width:"100%",height:"130px"}} />
                </div>)
            : <h3 style={{padding:"20px"}}>Image Preview</h3>}
           
             </div>
             <br/><br/>
             <div  style={{display:"flex",justifyContent:"center"}}>
                <label htmlFor="imageuploads" style={{width:"100%"}}>
                <img  style={{width:"30%",textAlign:"center",height:"130px"}} src={`http://cdn.onlinewebfonts.com/svg/img_212915.png`} />
                </label>
             </div>
             <small style={{color:"indianred"}}>*maximum images for upload is 4</small><br/>
              <input onChange={filechange2} style={{visibility:"hidden"}} type="file" id="imageuploads" multiple name="files" />
             <div>
                
                <textarea onChange={change} value={caption} className='form-control' placeholder='Caption this!'>

                </textarea>
                <br/>
                <button style={{width:'100%'}} onClick={uploadpost} className='btn btn-primary'>upload</button>
             </div>
             </div>     
            </div>
            </div>
           
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
                    {parseInt(params.userId) === parseInt(userid) ?
           <label htmlFor='profileimage' style={{backgroundColor:"white",padding:"6px",borderRadius:"10px",border:"2px solid lightgrey"}}>
          <small style={{color:"orange",fontSize:"13px"}}> <span className='fa fa-camera fa-2x' style={{color:"orange"}}></span> Edit</small>
           </label>
           : null}
             </div>
                    <img style={{width:"100%",borderRadius:"50%",margin:"10px",height:"260px",boxShadow:"2px 2px 5px 3px lightgrey"}} src={newImage.length > 0 ? newImage :user && user.image ? `https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${user.image}` : user && user.gender === "male" ? `https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425__340.png` : require(`./female.png`)} />
                    </div>
                  <div style={{display:"flex",padding:"0px",margin:"0"}}>
                    <div style={{width:"20%",padding:"0",margin:"0"}}>
                    <input type="file" style={{visibility:"hidden"}} name="profileimage" id="profileimage" onChange={filechange} />
                    </div>
                    <div style={{width:"60%",padding:"0",margin:"0"}}>
                      <small className='upload-success' style={{color:"green",transition:"opacity 2s",opacity:`${successmsg}`,fontWeight:"bold"}}> Image uploaded successfullly</small>
                      <small className='upload-failed' style={{color:"indianred",transition:"opacity 2s",opacity:`${failuremsg}`,fontWeight:"bold"}}> Image uploaded failed</small>
                    </div>
                    <div style={{width:"20%",padding:"0",margin:"0"}}>
                      <button style={{display:`${uploadbtn}`,padding:"5px"}} onClick={changeImage} className='btn btn-primary'>Upload</button>
                    </div>
                  </div>
            
            {props.online.includes(parseInt(user && user.userid)) ?                         
            <i style={{fontSize:"12px",color:"green",fontWeight:"bold",padding:"0",margin:"0"}}> Online</i>
                                 :
             <b> {formatlastSeen(user && user.lastseen)}</b>
            }
           <br/><br/><br/>
                     <h3>{user && user.name}</h3><br/>
                  <h5><span className='fa fa-phone text-muted mr-2'></span>{user.contact} <span className=' ml-3'> <button className='btn' style={{borderRadius:"100px",textTransform:"uppercase",backgroundColor:"indianred",color:"white",fontWeight:"bold"}}>
             call
            </button> </span></h5><br/>
                  <h5><span className='fa fa-envelope text-muted mr-2'> </span><span className='text-primary'>{user.email}</span></h5><br/>
                  <h5><span style={{color:"grey"}}>Hobbies </span>:<center> drinking water, smoking garri and eating fufu</center></h5><br/>
                  <h5><span style={{color:"grey"}}>Skills </span>:<center> software development, hair-making and basket-weaving</center></h5><br/>
                  <h5>{user.lastseen}</h5><br/>
                    
               
               
               
                   </div>







                   <div className='col-12 col-md-4' style={{backgroundColor:"white",padding:"30px",borderRightTopRadius:"30px"}}>
                 <div style={{textAlign:"center"}}>
                 <small style={{fontWeight:"bold",fontSize:"25px",textTransform:"uppercase"}}>{user && user.name}</small><br/>
                 <span style={{color:"grey",fontSize:"13px"}}>@{user && user.username}</span>
                 </div>
                  <div className='row' style={{marginTop:"15%"}}>
                    <div className='col-4' style={{textAlign:"center"}}>
                        <h1 style={{color:"black"}}>{user.following && JSON.parse(user.following).length || 0}</h1>
                        <p style={{color:"grey",fontSize:"14px"}}>Following</p>
                    </div>
                    <div className='col-4' style={{textAlign:"center"}}>
                    <h1 style={{color:"black"}}>{tempofollowers !== null ? tempofollowers.length : user.followers && JSON.parse(user.followers).length || 0}</h1>
                        <p style={{color:"grey",fontSize:"14px"}}>Followers</p>
                    </div>
                    <div className='col-4' style={{textAlign:"center"}}>
                    <h1 style={{color:"black"}}>{fullprofile.length}</h1>
                        <p style={{color:"grey",fontSize:"14px"}}>Posts</p>
                    </div>
                  </div>
                  {parseInt(params.userId) === parseInt(userid) ? null :
                  <div style={{marginTop:"30%"}}>
                <a href={`/chat/${user.userid}?display=messages`}> 
                 <button className='btn btn-primary' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <p> Message </p>
                    </button></a><br/><br/>
                    <button className={tempofollowers !== null && tempofollowers.includes(parseInt(userid)) ? 'btn btn-warning' : user.followers && JSON.parse(user.followers).includes(parseInt(userid)) ? 'btn btn-warning' : 'btn btn-success'} onClick={()=>follow(user.userid)} style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <p>{tempofollowers !== null && tempofollowers.includes(parseInt(userid)) ? "Unfollow" : user.followers && JSON.parse(user.followers).includes(parseInt(userid)) ? "Unfollow" : "Follow"} </p>
                    </button><br/><br/>
                    <button className='btn btn-danger' style={{borderRadius:"100px",width:"50%",fontWeight:"bold",textTransform:"uppercase",color:"white",fontWeight:"bold"}}>
                  <p> Delete User </p>
                    </button>
                  </div>
                  }
                  <br/><br/>
                  <div className='row mt-5'>
                    <div className='col-12' style={{borderRadius:"20px",border:"2px solid lightgrey",width:"100%"}}>
                   <p style={{fontSize:"15px",padding:"10px",borderBottom:"1px solid grey"}} className="mt-3 "><span style={{fontSize:"20px"}} className='fa fa-picture-o text-primary mr-2'></span> Media, Docx and Links <span style={{float:"right"}}> ~ 2</span></p>
                   {parseInt(params.userId) === parseInt(userid) ?
                  <p style={{fontSize:"15px",padding:"10px",borderBottom:"1px solid grey"}} className="mt-3 ">
                 <span style={{fontSize:"20px",border:"1px solid grey",padding:"3px",color:"indianred"}} className='fa fa-star-o  mr-2'></span>
                 <label for="backgroundimage">Wallpaper </label>
                 <i style={{float:"right"}}> {newbackgroundimage ? newbackgroundimage : user.backgroundImage ? "~" +user.backgroundImage.split("_")[1] : "none"}</i>
                  </p>
                 : null}
                   <input type="file" style={{display:"none"}} onChange={backgroundImageChange} id="backgroundimage"></input>
                   <p style={{fontSize:"15px",padding:"10px"}} className="mt-3 "><span style={{fontSize:"20px",border:"1px solid grey",padding:"5px",borderRadius:"20px"}} className='fa fa-users text-primary mr-2'></span> Groups in Common <span style={{float:"right"}}> ~ {commongroups.length}</span></p>
                   <div style={{padding:"0",margin:"0"}}>
                    {commongroups && commongroups.map((grps, index)=>
                      <small key={index} style={{fontSize:"12px"}}><span className='fa fa-users text-muted'></span> <i>{grps.title} <small style={{float:"right"}} className='text-muted'><b>Formed</b> {` ${grps.date}/${grps.month}/${grps.year}`}</small></i><br/>
                    </small>
                      )}
                   </div>

                    </div>
                  </div>
                  <br/><br/><br/>
                  <div style={{position:"absolute", bottom:"10px"}}>
                    <center><p style={{color:"grey",fontSize:"13px"}}>Joined <br/><b style={{color:"black"}}>{user.reg_date}/{user.reg_month}/2013</b></p></center>
                  </div>
                   </div>
                   <div className='d-none d-md-block col-md-2'></div>
                   </div>
                </div>
        <div onClick={upload} style={{position:"fixed",color:"white",cursor:"pointer",padding:"2px 10px",borderRadius:"20px",zIndex:"10",backgroundColor:"indianred",bottom:"10px",right:"10px"}}>
     <p> <span className={display === "none" ? 'fa fa-upload fa-2x' : 'fa fa-times fa-2x'} ></span> Upload</p>
        </div>
         <div className='container contain' style={{marginTop:"30px"}}>
           {fullprofile.length > 0 && fullprofile[0].caption  ? fullprofile.map(upload =>
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
               
                <div style={{margin:"0",padding:"0"}} key={img} className={`${upload.imgs && JSON.parse(upload.imgs).length === 1 ?`col-12` : upload.imgs && JSON.parse(upload.imgs).length === 3 ? `col-6` : `col-6`}`}>
               <a href={`/view-upload/${upload.uploadid}`}>
                 <img style={{width:"100%",height:`${upload.imgs && JSON.parse(upload.imgs).length > 1 ? "300px" : "500px"}`,padding:"2px",borderRadius:"3px"}} className="uploadedimage" data-src={`https://i.pinimg.com/originals/4f/43/2d/4f432d9234988a5f33b26e0ba06bc6fe.gif`} src={`https://res.cloudinary.com/fruget-com/image/upload/v1659901491/chatapp/uploads/${img}`}/>
                 </a>
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
}

export default Profile;