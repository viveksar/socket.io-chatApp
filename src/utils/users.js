//to keep track of our users by the use of array
let users=[]

//to add the user
let    addUser=({id,username,room})=>{
//to make user name and room in standard form by triming and converting to lower case
username=username.trim().toLowerCase()
room=room.trim().toLowerCase()

if((!username)||(!room)){
    return{
        error:'username and room must be provided'
    }
}
//to check there must not be any two individual with same user name
let existinguser=users.find((user)=>{
    return user.room===room&&user.username===username
})
 
//to validate the user
if(existinguser){
    return{
        error:'username has already been acquired'
    }
}

//to store the user
let user={id,username,room}

users.push(user)
return {user}

}

//to remove the user
let removeUser=(id)=>{
   let index=users.findIndex((user)=> user.id===id)
//if no user found the index will be -1 and else it will be grater then 0
if(index!==-1){
    //means we found a user
    return users.splice(index,1)[0]
}

}

//getUsersInRoom
let getUsersInRoom=(roomName)=>{
    let roomUsers=[]
    roomUsers=users.filter((user)=>{
        if(user.room===roomName){
            return user
        }
    })
    return roomUsers
}

//get user means we can get the user by providing its id

let getUser=(id)=>{
    let getuser=users.filter((user)=>{
        if(user.id===id){
            return user
        }
    })
    return getuser
}

module.exports={
    addUser,
    removeUser,
    getUsersInRoom,
   getUser
 
}