const express=require("express");
const app=express();
const http=require("http");
const path=require("path");
const server=http.createServer(app);
const socketio=require("socket.io");
const io=socketio(server);
const {addUser,removeUser,getUsersInRoom,getUser}=require("../../client/src/utils/users")
const port=process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "../../client/build")));



app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
  });
  

let count=0;

io.on('connection',(socket)=>{
    console.log("new websocket connection");
   
    
    socket.emit("countUpdated",count);

    socket.on('join',(id,username,room,next)=>{
        const {error,user}=addUser(id,username,room);

        if(error){
            return next(error);
        }
        socket.join(user.room);
        // console.log(room,username)

        socket.emit("message","welcome");

        socket.broadcast.to(user.room).emit("message",`${user.username} has joined!`);
    })

    socket.on("increment",()=>{
    //    count++;
       io.emit("countUpdated",count);
    });

    
    socket.on("sendMessage",(message,id,next)=>{
        // io.emit("message",`type message is : ${message}`);
        const user=getUser(id);
        let messageTime=new Date().toLocaleTimeString();
       
        io.to(user.room).emit("messageArray",message,messageTime,username);

        next("Delivered!")
    })

 

    socket.on("geoLocation",(data)=>{
        const user=getUser(data.id);
        io.to(user.room).emit("sendLocationUrl",`https://google.com/maps?q=${data.Long},${data.Latit}`);
    });


    socket.on("disconnect",(id)=>{
        const user=removeUser(id);
        console.log(user,"iyv");
        io.emit("message","a user has left");
    })
})



server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})