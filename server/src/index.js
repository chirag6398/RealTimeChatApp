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
    socket.emit("message","welcome");
    socket.broadcast.emit("message","a new user has joined");
    socket.emit("countUpdated",count);

    socket.on("increment",()=>{
       count++;
       io.emit("countUpdated",count);
    });

    socket.on("sendMessage",(message,next)=>{
        io.emit("message",`type message is : ${message}`);
        io.emit("messageArray",message);
        next("Delivered!")
    })

    socket.on("geoLocation",(data)=>{
        io.emit("message",`https://google.com/maps?q=${data.Long},${data.Latit}`);
    });

    socket.on("disconnect",()=>{
        io.emit("message","a user has left");
    })
})





server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})