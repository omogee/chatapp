import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
const CryptoJS = require("crypto-js")

function Groups(props) {
 const [groups, setgroups] = useState([])
 const [ownerid, setownerid] = useState("")

useEffect(()=>{
    if(Cookies.get("cvyx")){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      setownerid(parseInt(decryptedData))
 axios.get("http://localhost:5000/fetch-groups")
 .then(res=> {
    if(res.data.status === "success"){
        setgroups(res.data.groups)
    }
 })
 .catch(err => console.log(err))
}
}
,[])
 const joingroup=(groupId)=>{
    if(Cookies.get("cvyx")){
        var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
      var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    axios.get(`http://localhost:5000/join-group?ownerid=${decryptedData}&groupid=${groupId}`)
    .then(res=> {
        if(res.data.status === "success"){
            console.log("done")
        }
    })
    .catch(err => console.log(err))
}
}

    return (  
        <div className='container'>
            <div className='row' style={{marginTop:"80px"}}>
                <div className='col-12'>
                    <center><p style={{fontSize:"20px",color:"grey"}}><span className='fa fa-users'> </span>({groups.length})</p></center>
                </div>
            </div>
                      {groups.map(connect =>
                  
                        <div className='row'  key={connect.groupid} style={{padding:"5px",borderBottom:"0.4px solid lightgrey"}}>
                            <div className='col-3' style={{padding:"5px"}}>
                                <img style={{borderRadius:"50%",width:"100%",height:"70px",border:"2px solid lightgrey",padding:"1px"}} src={connect.image ? `https://res.cloudinary.com/fruget-com/image/upload/v1659648594/chatapp/profilepicture/${connect.image}` : `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZGwJBI7Lc_HwIroVIGs9zWvHTUf9XK40STQ&usqp=CAU` } />
                            </div>
                            <div className='col-9' style={{position:"relative"}}>
                                <div style={{position:"absolute",left:"0",top:"10%",lineHeight:"1",width:"100%"}}>
                          <a href={`/chat/group/${connect.groupId}?display=groups`} style={{textDecoration:"none",width:"100%"}}>
                                <small style={{fontSize:"17px",padding:"0",margin:"0",color:"black"}}>{connect.title}</small> 
                                </a>
                                {connect.members && !JSON.parse(connect.members).includes(ownerid) ? 
                                <span  style={{float:"right",textAlign:"right"}}> 
                                <button className='btn btn-primary' onClick={()=>joingroup(connect.groupId)}>+ Join </button>
                                 </span> 
              : null}
              <br/>
                                <br/><br/> <small style={{fontSize:"12px",color:"grey"}}>{connect.about && connect.about.length > 30 ? connect.about.slice(0,30) + "...": connect.about}</small>
                               
                                <br/>
                             
                                  </div>
                            </div>
                            
                        </div>
                  
                        )}
              </div>
     );
}

export default Groups;