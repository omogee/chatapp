import axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import Uploads from './upload';
import {useParams} from "react-router-dom"
import {formatermain} from "./formatTime"
import Cookies from 'js-cookie';
import { createContext } from 'react';
import { userContext } from './contextJs';
const CryptoJS = require("crypto-js")

function ViewUpload() {
    const [selectedpost, setselectedpost] =useState({})
    const [tempolikes, settempolikes] = useState({})
    const [comment, setComment] = useState("")
    const [comments, setcomments] = useState([])
    const [mainuser, setmainuser] = useState("")
    const user = createContext(userContext)
    const {singleuser, setsingleuser} = user;
    const [commentadded, setcommentadded] = useState("0")

    const params= useParams()

    useEffect(()=>{
        if(Cookies.get("cvyx") ){ 
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          setmainuser(decryptedData)
     axios.get(`https://realchatapps.herokuapp.com/view-upload?uploadid=${params.uploadid}`)
     .then(res => {
        if(res.data.status === "success"){
            setselectedpost(res.data.post)
            setcomments(res.data.comments)
        }
     })
     .catch(err => console.log(err))
    }
    },[])
    const like =()=>{
    alert("done")
    }
    const change =(e)=>{
       setComment(e.target.value)
    }
    const addComment =(e)=>{
        e.preventDefault()
        setComment("")
      if(comment.length > 0){
        axios.get(`https://realchatapps.herokuapp.com/upload-comment?mainuser=${mainuser}&&uploadid=${params.uploadid}&&comment=${comment}`)
        .then(res =>{
            if (res.data.status === "success"){
                setcomments(res.data.comments)
                setcommentadded("1")
                setTimeout(()=>{
                    setcommentadded("0")
                   }, 3000)
            }
        })
        .catch(err => console.log(err))
      }
    }
    console.log("singleuser", singleuser)
    return (  
        <div style={{backgroundColor:"rgba(242,242,242)"}}>
        <div className='container'>
          <div className='row'>
            <div className='d-none d-md-block col-7' style={{height:'100%',overflow:'scroll'}}>
                <Uploads contain={"contain"}/>
            </div>
            <div className='col-12 col-md-5' style={{margin:"80px 0px",height:"100%",overflow:"scroll"}}>
            <div style={{backgroundColor:"white",marginBottom:"10px",borderRadius:"10px",padding:"10px",boxShadow:"2px 2px 3px 3px  lightgrey"}}>
            <div style={{display:"flex",width:"100%",flexWrap:"nowrap"}}>
                <div className='imagedisplay' style={{padding:"5px"}}>
                    <img src={`https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${selectedpost.image}`} style={{width:"100%",border:"1px solid grey",borderRadius:"50%",height:"50px"}}/>
                </div>
                <div style={{width:"70%"}}>
                  <a href={`/profile/${selectedpost.userid}`} style={{textDecoration:"none"}}> <small style={{fontWeight:"bold",color:"black"}}>{selectedpost.name}</small></a><br/>
                   <small style={{color:"grey"}}> @{selectedpost.username}. {formatermain(selectedpost.time)}</small>
                </div>
            </div>
            <div style={{width:"100%"}}>
                <p>{selectedpost.caption}</p>
                <small></small>
             </div>
             <div className='row' style={{padding:"2px 15px"}}>            
                {selectedpost.imgs && JSON.parse(selectedpost.imgs) ? 
              JSON.parse(selectedpost.imgs).map(img =>
                <div style={{margin:"0",padding:"0"}} className={`${selectedpost.imgs && JSON.parse(selectedpost.imgs).length === 1 ?`col-12` : selectedpost.imgs && JSON.parse(selectedpost.imgs).length === 3 ? `col-6` : `col-6`}`}>
               <img style={{width:"100%",height:`${selectedpost.imgs && JSON.parse(selectedpost.imgs).length > 1 ? "200px" : "400px"}`,padding:"2px",borderRadius:"3px"}} className="uploadedimage" data-src={`https://i.pinimg.com/originals/4f/43/2d/4f432d9234988a5f33b26e0ba06bc6fe.gif`} src={`https://res.cloudinary.com/fruget-com/image/upload/v1659901491/chatapp/uploads/${img}`}/>
                </div>
                  )
           : null}
              </div>
             
                <div style={{display:"flex",width:"100%", justifyContent:"space-between"}}>
                    <div className='ml-3' style={{width:"20%",padding:"5px"}}>
                        <span className={tempolikes[`${selectedpost.uploadid}`] && tempolikes[`${selectedpost.uploadid}`].includes(parseInt(mainuser)) ? 'fa fa-thumbs-up text-primary' : selectedpost.likes && JSON.parse(selectedpost.likes).includes(parseInt(mainuser)) ? 'fa fa-thumbs-up text-primary' : 'fa fa-thumbs-o-up text-primary'} onClick={()=>like(selectedpost.uploadid)} style={{fontSize:"20px"}}></span>
                         <small style={{fontSize:"18px"}} className={tempolikes[`${selectedpost.uploadid}`] && tempolikes[`${selectedpost.uploadid}`].includes(parseInt(mainuser)) ? "text-primary ml-1" :selectedpost.likes && JSON.parse(selectedpost.likes).includes(parseInt(mainuser)) ? "text-primary ml-1" : "text-muted ml-1"}>{tempolikes[`${selectedpost.uploadid}`] && tempolikes[`${selectedpost.uploadid}`].length || selectedpost.likes && JSON.parse(selectedpost.likes).length}</small>
                    </div>
                    <div style={{width:"20%"}}>
                    <span className='ml-3 fa fa-comment-o' style={{fontSize:"20px",color:"red"}}></span> <small style={{fontSize:"18px"}}>{selectedpost.likes && JSON.parse(selectedpost.likes).length}</small>
                    </div>
                
             </div>
             
             <div style={{display:"flex",padding:"0",margin:"0"}}>
             <div style={{padding:"10px"}}>
                    <img src={singleuser ? `https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${singleuser.image}` : "https://i.stack.imgur.com/sXK51.png"} style={{width:"100%",border:"1px solid grey",borderRadius:"50%",height:"50px"}}/>
                </div>
                <div className='imagedisplay' style={{width:"80%",padding:"5px"}}>
                    <form method="get" onSubmit={addComment}>
                    <input type='text' className='form-control' style={{border:"1px solid lightgrey",borderRadius:"20px",padding:"5px"}} name="comment" onChange={change} value={comment} placeholder="Write a Comment"></input><br/>
                    <button className='d-none btn text-primary' style={{padding:"0",visibility:"hidden"}} type="submit">submit</button>
                    </form>
           </div>
           </div>
          <center> <small className='upload-success' style={{color:"green",fontStyle:"italic",transition:"opacity 2s",opacity:`${commentadded}`,fontWeight:"bold"}}> Comment added successfullly</small></center>
           <div>
           </div>
           {comments && comments.map(comm => 
           <div style={{display:"flex"}} key={comm.commentid} >
            <div className='imagedisplay mt-2' style={{padding:"2px"}}>
            <img src={`https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${comm.image}`} style={{width:"100%",border:"1px solid grey",borderRadius:"50%",height:"50px"}}/>
            </div>
            <div style={{width:"80%",padding:"5px"}}>
            <div style={{backgroundColor:"rgba(242,242,242)",borderRadius:"15px",padding:"10px",border:"1px solid lightgrey"}}>
            <a href={`/profile/${comm.userid}`} style={{textDecoration:"none"}}> <small style={{fontWeight:"bold",color:"black"}}>{comm.name}</small>
            <small style={{float:"right",color:"grey"}}>{formatermain(comm.time)}</small></a><br/>
            <div style={{lineHeight:"0.9",padding:"0px"}}>
            <i><small >{comm.comment}</small></i>
            </div>
            </div>
             <small className='ml-3' style={{color:"grey",fontWeight:"bold"}}>LIKE .</small>
           </div>
           </div>
           )}
           </div>
            </div>
          </div>
        </div>
        </div>
    );
}

export default ViewUpload;