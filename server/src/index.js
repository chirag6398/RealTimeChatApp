const express=require("express");
const app=express();
const http=require("http");
const path=require("path");
const server=http.createServer(app);
const socketio=require("socket.io");
const io=socketio(server);
const port=process.env.PORT || 5000;

app.use(express.static(path.resolve(__dirname, "../../client/build")));



app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../../client/build", "index.html"));
  });
  

let count=0;

io.on('connection',(socket)=>{
    console.log("new websocket connection");
   
    
    socket.emit("countUpdated",count);

    socket.on('join',({username,room})=>{
        socket.join(room);
        console.log(room,username)

        socket.to(room).emit("message","welcome");

        socket.broadcast.to(room).emit("message",`${username} has joined!`);
    })

    socket.on("increment",()=>{
    //    count++;
       io.emit("countUpdated",count);
    });

    
    socket.on("sendMessage",({message,room,username},next)=>{
        // io.emit("message",`type message is : ${message}`);
        let messageTime=new Date().toLocaleTimeString();
       
        io.to(room).emit("messageArray",message,messageTime,username);

        next("Delivered!")
    })


    socket.on("geoLocation",(data)=>{
        io.to(data.room).emit("sendLocationUrl",`https://google.com/maps?q=${data.Long},${data.Latit}`);
    });


    socket.on("disconnect",()=>{
        io.emit("message","a user has left");
    })
})





server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})