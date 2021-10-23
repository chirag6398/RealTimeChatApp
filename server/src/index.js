const express=require("express");
const app=express();
const http=require("http");
const path=require("path");
const server=http.createServer(app);
const socketio=require("socket.io");
const io=socketio(server);
const {addUser,removeUser,getUsersInRoom,getUser}=require("./utils/users")
const port=process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "../../client/build")));

app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
  });
  
io.on('connection',(socket)=>{
    socket.on('join',({username,room},next)=>{

        const {error,user}=addUser({id:socket.id,username,room});

        if(error){
            return next(error);
        }

        socket.join(user.room);

        socket.emit("message","welcome!!!");
        socket.broadcast.to(user.room).emit("message",`${user.username} has joined!`);

        next();
    })

    socket.on("sendMessage",(message,username,room,next)=>{
       
        const user=getUser(socket.id);
       
        let messageTime=new Date().toLocaleTimeString();
       
        io.to(user?.room).emit("messageArray",message,messageTime,username);

        next("Delivered!");
    })


    socket.on("geoLocation",(data)=>{
        const user=getUser(socket.id);
       
        io.to(user?.room).emit("sendLocationUrl",`https://google.com/maps?q=${data.Long},${data.Latit}`);
    });

    socket.on("disconnect",()=>{
        const user=removeUser(socket.id);
        
        io.to(user?.room).emit("message","a user has left");
    })
})


server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})