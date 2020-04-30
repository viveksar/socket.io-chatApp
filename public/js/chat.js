//to store all io function in a  variable
let socket=io()

//variables of the elements
let $messageform=document.querySelector('#message-form')
let $messageformInput=$messageform.querySelector("input")
let $messageformButton=$messageform.querySelector('button')
let $sendlocationButton=document.getElementById('send-location')
let $message=document.querySelector('#messages')


//to get access to our templates
let messageTemplate=document.querySelector('#message-template').innerHTML  //innerHTML is used to get the html inside of the template
let locationTemplate=document.querySelector('#location-message-template').innerHTML
let sidebarTemplate=document.querySelector('#sidebar-template').innerHTML


//here is the function to set the autoscroll functionality to the application
const autoscroll = () => {
    // New message element
    const $newMessage = $message.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $message.offsetHeight

    // Height of messages container
    const containerHeight = $message.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $message.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $message.scrollTop = $message.scrollHeight
    }
}
socket.on('message',(message)=>{
    //to render the messageTemplate 
    let html=Mustache.render(messageTemplate,{
        username:message.username,
        message:message.text,
        //moment is the library to manipulate our time and send time in our desired format
        createdAt:moment(message.createdAt).format('hh:mm a')
    })
  
    //to put the rendered template in the div of the message
  $message.insertAdjacentHTML('beforeend',html)
autoscroll()
    console.log(message)
})

//to get the locationMessage from the server
socket.on('locationMessage',(url)=>{
//to render the location template
let html=Mustache.render(locationTemplate,{
    username:url.username,
    location:url.location,
    createdAt:moment(url.createdAt).format('hh:mm a')
})

$message.insertAdjacentHTML('beforeend',html)

    console.log(url)
})

//to listen for the event roomData
socket.on('roomData',({room,users})=>{
  let html=Mustache.render(sidebarTemplate,{
    room  :room,
    users:users
  })
  document.querySelector('#sidebar').innerHTML=html
})




$messageform.addEventListener('submit',(e)=>{
    e.preventDefault()

    //to disable the send button once the message is send
    $messageformButton.setAttribute('disabled','disabled');

    
   // let message=document.getElementById('message').value
   //here by e.target we get the target means the form and by using name property as message we ger access to our required thing
    let message=e.target.message.value

    //to send message back to the server
    socket.emit('message',message,(error)=>{
        //to make our send button functional after the message has been delivered
        $messageformButton.removeAttribute('disabled','disabled')
        $messageformInput.value=""
        $messageformInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('message delivered')
       
    })

   
})



//to share the location of the user
$sendlocationButton.addEventListener('click',()=>{

  
    if(!navigator.geolocation){
    
        return alert("your browser does not support this feature. Kindely user this application in updated version")
    }
  
        //to disable the button when the message is being send
        $sendlocationButton.setAttribute('disabled','disabled')

//if the browser is updated
//to get the current location
navigator.geolocation.getCurrentPosition((position)=>{
//we have to send this long and lati to the server
socket.emit('location',{
    longitude:position.coords.longitude,
    latitude:position.coords.latitude

},(message)=>{
    $sendlocationButton.removeAttribute('disabled','disabled')
    console.log('location shared:',message)
})

})
})


//to parse our query string 
let {username,room}= Qs.parse(location.search,{ignoreQueryPrefix:true})
//to send user name and room to the server
socket.emit('join',{username,room},(error)=>{

})