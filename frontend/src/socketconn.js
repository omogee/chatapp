import Cookies from "js-cookie"
import io from "socket.io-client"

const CryptoJS = require("crypto-js")

const socket = io("https://realchatapps.herokuapp.com")

if(Cookies.get("cvyx")){
    var bytes = CryptoJS.AES.decrypt(Cookies.get("cvyx"), 'my-secret-key@123');
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  socket.emit("addUser", parseInt(decryptedData))
}
socket.on("connect", ()=>{
   // alert("connected")
})
socket.on("disconnect", ()=>{
   // alert("disconnected")
})
export default socket