//here we will create  a message and send them to our chat.js file so that we can use this message whenever needed
let generateMessage=(username,text)=>{
   return{
      username:username,
    text:text,
    createdAt:new Date().getTime()
   }

}

let locationMessage=(username,location)=>{
   return{  
      username,
       location:location,
       createdAt:new Date().getTime()
   }
}



module.exports={
   generateMessage,
   locationMessage
}