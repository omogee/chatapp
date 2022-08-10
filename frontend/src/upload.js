import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { formatermain } from './formatTime';
import "./main.css"
const CryptoJS = require("crypto-js")

function Uploads() {
    const [uploads, setUploads] = useState([])
    const [display, setdisplay] = useState("none")
    const [mainuser, setmainuser] = useState("")
    const  [images, setimages] = useState([])
    const [tempolikes, settempolikes] = useState({})
    const [files, setfiles] = useState([])
    const [caption, setcaption] = useState("")
  
  const  filechange=(e)=>{
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
    useEffect(()=>{
        if(Cookies.get("cvyx") ){ 
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          setmainuser(decryptedData)
        axios.get(`http://localhost:5000/fetch-uploads`)
        .then( res => {setUploads(res.data)})
        .catch(err => console.log(err))
        }
    })
    useEffect(()=>{
        const options ={
            rootMargin:"0px",
            root: null,
            threshold:0.2
        }
    const element = document.querySelectorAll(".uploadedimage")
    const callback=(entries)=>{
        entries.forEach(entry=>{
           if(entry.isIntersecting){
               entry.target.src= entry.target.dataset.src
            }
        }) 
    }
    const observer= new IntersectionObserver(callback, options)
    element.forEach(elem =>{
        observer.observe(elem)
    })
    
    },[])
    const like =(uploadid)=>{
        if(Cookies.get("cvyx") ){ 
            var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        axios.get(`http://localhost:5000/like-post?uploadid=${uploadid}&&id=${decryptedData}`)
        .then(res =>{ 
            if(res.data.status === "success"){
      settempolikes({...tempolikes, [`${uploadid}`]:res.data.likes})
        }
    })
        .catch(err => console.log(err))
        }
    }
    useEffect(()=>{
        console.log(tempolikes)
    },[tempolikes])
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
    .then( res => {console.log(res.data)})
    .catch(err => console.log(err))
}
}
const removeImage=(img,index)=>{
  setimages(images.filter(prev => prev !== img))
  setfiles(files.filter((prev,i)=> i !== index))
}

    const Addpost =()=>{
        return(
            <div>
                <br/>
            <div className='container' style={{backgroundColor:"lightgrey",marginTop:"100px",padding:"0px 300px"}}>
                <br/>
            <div style={{backgroundColor:"white",padding:"20px",borderRadius:"20px"}}>
             <div style={{position:"absolute",right:"5px",top:'5px'}}>
              <span className='fa fa-times ' style={{fontSize:"25px"}}></span>
             </div>
             <div style={{display:"flex",flexWrap:"wrap"}}>
                {images.length > 0 ? images.map(img => 
                <div style={{width:"45%",position:"relative",height:"100px",padding:"3px"}}>
                <div style={{position:"absolute",right:"2px",top:'2px'}}>
              <span className='fa fa-times text-danger' onClick={()=>removeImage(img)} style={{fontSize:"20px"}}></span>
             </div>
                    <img src={img} style={{padding:"5px",border:"1px solid lightgrey",borderRadius:"10px",width:"100%",height:"90px"}} />
                </div>)
            : <h3>Image Preview</h3>}
            <small style={{color:"indianred"}}>*maximum images for upload is 4</small><br/>
             </div>
             <div  style={{display:"flex",justifyContent:"center"}}>
                <label htmlFor="imageuploads" style={{width:"100%"}}>
                <img  style={{width:"40%",textAlign:"center",height:"100px"}} src={`http://cdn.onlinewebfonts.com/svg/img_212915.png`} />
                </label>
             </div>
              <input onChange={filechange} type="file" id="imageuploads" multiple name="files" />
             <div>
                
                <textarea onChange={change} value={caption} className='form-control' placeholder='Caption this!'>

                </textarea>
                <br/>
                <button style={{width:'100%'}} onClick={uploadpost} className='btn btn-primary'>upload</button>
             </div>
             </div>
            </div>
            </div>
        )
    }

   
    return ( 
       <div style={{backgroundColor:"lightgrey"}}>
       <br/>
        <div style={{position:"fixed",color:"lightgrey",padding:"2px 10px",borderRadius:"20px",zIndex:"10",backgroundColor:"indianred",bottom:"10px",right:"10px"}}>
     <p> <span className='fa fa-upload fa-2x' onClick={()=> setdisplay(display === "block" ? "none" : "block")}></span> Upload</p>
        </div>
         <div className='container contain' style={{margin:"80px 0px"}}>
         <div style={{display:`${display}`}}>
                <br/>
            <div  style={{position:"relative",backgroundColor:"white",marginBottom:"10px",padding:"20px",borderRadius:"20px"}}>
             <div style={{position:"absolute",right:"5px",top:'5px'}}>
              <span className='fa fa-times text-muted' onClick={()=> setdisplay("none")} style={{fontSize:"30px",fontWeight:"lighter"}}></span>
             </div>
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
              <input onChange={filechange} style={{visibility:"hidden"}} type="file" id="imageuploads" multiple name="files" />
             <div>
                
                <textarea onChange={change} value={caption} className='form-control' placeholder='Caption this!'>

                </textarea>
                <br/>
                <button style={{width:'100%'}} onClick={uploadpost} className='btn btn-primary'>upload</button>
             </div>
             </div>
         
            </div>
             <div >
           {uploads.length > 0 ? uploads.map(upload =>
           <div style={{backgroundColor:"white",marginBottom:"10px",borderRadius:"10px",padding:"10px",border:"1px solid lightgrey"}} key={upload.id}>
            <div style={{display:"flex",width:"100%",flexWrap:"nowrap"}}>
                <div style={{width:"11%",padding:"5px"}}>
                    <img src={`https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${upload.image}`} style={{width:"100%",border:"1px solid grey",borderRadius:"50%",height:"50px"}}/>
                </div>
                <div style={{width:"70%"}}>
                  <a href={`/profile/${upload.userid}`} style={{textDecoration:"none"}}> <small style={{fontWeight:"bold",color:"black"}}>{upload.name}</small></a><br/>
                   <small style={{color:"grey"}}> @{upload.username}. {formatermain(upload.time)}</small>
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
                        <span className={tempolikes[`${upload.uploadid}`] && tempolikes[`${upload.uploadid}`].includes(parseInt(mainuser)) ? 'fa fa-thumbs-up text-primary' : upload.likes && JSON.parse(upload.likes).includes(parseInt(mainuser)) ? 'fa fa-thumbs-up text-primary' : 'fa fa-thumbs-o-up text-primary'} onClick={()=>like(upload.uploadid)} style={{fontSize:"20px"}}></span>
                         <small style={{fontSize:"18px"}} className={tempolikes[`${upload.uploadid}`] && tempolikes[`${upload.uploadid}`].includes(parseInt(mainuser)) ? "text-primary ml-1" :upload.likes && JSON.parse(upload.likes).includes(parseInt(mainuser)) ? "text-primary ml-1" : "text-muted ml-1"}>{tempolikes[`${upload.uploadid}`] && tempolikes[`${upload.uploadid}`].length || upload.likes && JSON.parse(upload.likes).length}</small>
                    </div>
                    <div style={{width:"20%"}}>
                    <span className='ml-3 fa fa-comment-o' style={{fontSize:"20px",color:"red"}}></span> <small style={{fontSize:"18px"}}>{upload.likes && JSON.parse(upload.likes).length}</small>
                    </div>
                
             </div>
             
             <div style={{display:"flex",padding:"20px"}}>
                <div style={{width:"100%"}}>
                    <textarea className='form-control' placeholder={"Be the first to comment"}></textarea><br/>
                    <button className='btn btn-primary'>submit</button><div>
           </div>
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
       </div>
     );
}

export default Uploads;