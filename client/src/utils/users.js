const users=[];

const addUser=(id,username,room)=>{
    // username=username.toLowerCase();
    // room=room.trim().toLowerCase();
    console.log(username,room,"utils")
    if(!username || !room){
        return {
            error:"username and room field are required"
        }
    }

    const existUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    if(existUser){
        return {
            error:"username is in use"
        }
    }

    const user={id,username,room};
    users.push(user);

    return {user};
}

const getUser=(id)=>{
    users.find((user)=>{
        return user.id===id;
    })
}

const getUsersInRoom=(room)=>{
    return users.filter((user)=>{
        user.room===room
    })
}

const removeUser=(id)=>{
    const index=users.findIndex((user)=>{ 
          return user.id===id
    })

    if(index !==-1){
        return users.splice(index,1)[0];
    }
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

