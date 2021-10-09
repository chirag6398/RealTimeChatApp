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

io.on('connection',()=>{
    console.log("new websocket connection")
})




server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
})