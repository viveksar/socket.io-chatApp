let express=require('express')
let http=require('http')
let app=express()
//to create a new server
let server=http.createServer(app)
let path=require('path')
let port=process.env.PORT||3000
let socketio=require('socket.io')
let{   addUser,removeUser,getUsersInRoom,getUser}=require('./utils/users')

//here is the pakage for the filteration of bad words
let Filter=require('bad-words')

let {generateMessage,locationMessage}=require('./utils/messages')

//we created server seprated from express so that we can pass server in socketio
let io=socketio(server)

//to join to the public directry path
let publicdirectrypath=path.join(__dirname,'../public')

//to use public directery
app.use(express.static(publicdirectrypath))


//to make connection with our client
io.on('connection',(socket)=>{
    console.log('new client is connected')

    //socket.emit('message',generateMessage('welcome '))
   //to listen for the username and room provided by the client
   socket.on('join',({username,room},callback)=>{
   
//to add a new user to the array
let {error,user}=   addUser({id:socket.id,username,room})

if(error){
    return callback(error)
}
           //here is the code to join the room
           socket.join(user.room)

    socket.emit('message',generateMessage("Admin",'Welcome'))
  //to send thee welcome message to the client joined
  socket.broadcast.to(user.room).emit('message',generateMessage("Admin",`${user.username} has joined the room`))

 //to fetch the list of user present in the chat room
   io.to(user.room).emit('roomData',{
   room:user.room,
  users:getUsersInRoom(user.room)
            })
 


  //if everything gone well
  callback()
   })
 
   //when we get the daata from the client
   socket.on('message',(message,callback)=>{
       //to check for profanity in the message
       let filter=new Filter()

       //to get the user from its id
       let user=getUser(socket.id)[0]
      
       if(filter.isProfane(message)){
           return callback('profanity is not allowed')
       }
       //to get the user by using its id

       //to send the message to all the client connected
       io.to(user.room).emit('message',generateMessage(user.username,message))
       callback()
   })

   //to share the location of a particular user to everyone
  socket.on("location",(cords,callback)=>{
      let user=getUser(socket.id)[0]
      io.to(user.room).emit('locationMessage',locationMessage(user.username,`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
      callback('done')
  })

   //when a user is disconnected
   socket.on('disconnect',()=>{
//to remove the user when it is disconnected
let user=removeUser(socket.id)

if(user){
    io.to(user.room).emit("message",generateMessage("Admin",`${user.username} has left the room`))
      //to fetch the list of user present in the chat room
  io.to(user.room).emit('roomData',{
    room:user.room,
    users:getUsersInRoom(user.room)
})
}   
   })
})



server.listen(port,()=>{
    console.log("The server has started on port "+port)
})