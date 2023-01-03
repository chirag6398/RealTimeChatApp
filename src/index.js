const express=require("express");
const app=express();
const http=require("http");
const path=require("path");
const dotenv=require("dotenv");
const server=http.createServer(app);
dotenv.config({ path: "./config.env" });
const socketio=require("socket.io");

const io=socketio(server);

const {addUser,removeUser,getUsersInRoom,getUser}=require("./utils/users")
const port=process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "../client/build")));


app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
  
io.on('connection',(socket)=>{
    socket.on('join',({username,room},next)=>{

        const {error,user}=addUser({id:socket.id,username,room});
       
        if(error){
            return next(error);
        }

        socket.join(user.room);
       
        socket.emit("message","welcome!!!");
        io.to(user?.room).emit("roomData",{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        socket.broadcast.to(user.room).emit("message",`${user.username} has joined!`);

        next();
    })
    

    socket.on("sendMessage",({message,username},next)=>{
       
        const user=getUser(socket.id);
       
        let messageTime=new Date().toLocaleTimeString();
       
        io.to(user?.room).emit("messageArray",message,messageTime,username);

        next("Delivered!");
    })

    
    socket.on("geoLocation",(data)=>{
        const user=getUser(socket.id);
        let messageTime=new Date().toLocaleTimeString();
        io.to(user?.room).emit("sendLocationUrl",`https://google.com/maps?q=${data.Long},${data.Latit}`,messageTime,user?.username);
    });

    socket.on("disconnect",()=>{
        const user=removeUser(socket.id);
        if(user){
            io.to(user?.room).emit("message",`${user?.username} has left`);
            io.to(user?.room).emit("roomData",{
                room:user.room,
                users:getUsersInRoom(user?.room)
            })
        }
        
    });
})



server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})