
const connectedusers =[]
const typingUsers ={}
function AddUser(data){
    const user ={userId:data.userId, socketId:data.socketId}
  if(connectedusers.length === 0 || connectedusers.includes(user)){
    connectedusers.push(user)
    return user
    }else{   
        for (var i =0; i<connectedusers.length; i++){
            if( connectedusers[i].userId === data.userId){
                return user;
            }else{
            connectedusers.push(user)
            return user
            }
    
        }
}
}

function addTypingUser(data){
  if(!typingUsers[`${data.recievingclient}`] || typingUsers[`${data.recievingclient}`].length === 0){
      typingUsers[`${data.recievingclient}`] =[parseInt(data.typingclient)]
      return typingUsers[`${data.recievingclient}`];
  }else if(!typingUsers[`${data.recievingclient}`].includes(parseInt(data.typingclient))){
      typingUsers[`${data.recievingclient}`].push(parseInt(data.typingclient))
      return typingUsers[`${data.recievingclient}`];
  }else{
      return typingUsers[`${data.recievingclient}`];
  }
}
function removeTypingUser(data){
    if(!typingUsers[`${data.recievingclient}`] || typingUsers[`${data.recievingclient}`].length <= 1){
      return [];
  }else if(typingUsers[`${data.recievingclient}`].includes(parseInt(data.typingclient))){
    const index = typingUsers[`${data.recievingclient}`].findIndex(ind => parseInt(ind) === parseInt(data.typingclient))
    console.log("index",index)
     if(index !== -1){
        console.log("for example", [9].splice(0,1)[0])
         return typingUsers[`${data.recievingclient}`].splice(index,1)[0]
        }
      return typingUsers[`${data.recievingclient}`];
  }else{
      return typingUsers[`${data.recievingclient}`];
  }
}
function removeUser(id){
   const index = connectedusers.findIndex(conn => conn.socketId === id || conn.userId === id)
   if(index !== -1){
         return connectedusers.splice(index,1)[0]
        }
}
 function getTypingALLUsers (data){
     if(!typingUsers[`${data}`] || typingUsers[`${data}`].length === 0){
         return [];
     }
     return typingUsers[`${data}`];
 }
function getCurrentUser(data){
    return connectedusers.find(user => parseInt(user.userId) === parseInt(data))
}
function getConnectedUsers(){
     let userArray = []
    for (var i =0; i<connectedusers.length; i++){
        console.log(i, connectedusers[i].userId)
        userArray.push(connectedusers[i].userId)
    }
    return userArray
}


module.exports={
AddUser,
getConnectedUsers,
removeUser,
getCurrentUser,
addTypingUser,
removeTypingUser,
getTypingALLUsers
}