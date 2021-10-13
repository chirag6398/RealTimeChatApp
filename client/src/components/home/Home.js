import React,{useState,useEffect} from 'react';
import {io} from "socket.io-client";

export default function Home() {
const [socket,setSocket]=useState(null);
const [message,setMessage]=useState("");
useEffect(()=>{
    setSocket(io("ws://localhost:5000"));
},[]);

useEffect(()=>{
    socket?.on("countUpdated",(count)=>{
        console.log("the count has been updated",count);
    });
    socket?.on("message",(message)=>{
        console.log(message);
    })

},[socket]);

const clickHandler=()=>{
    console.log("clicked");
    socket.emit("increment")
};

const getLocationHandler=()=>{
    if(!navigator.geolocation){
        console.log("can not access location");
    }else{
        navigator.geolocation.getCurrentPosition((position)=>{
             console.log(position);
             socket.emit("geoLocation",{
                Long:position.coords.longitude,
                Latit:position.coords.latitude
            })
        })
      
    }
}

const submitHandler=()=>{
    socket.emit("sendMessage",message);
    console.log(message);
    setMessage("");

}
    return (
        <div className="home__extDiv">
            <div className="home__mainDiv">
                <span>Chat App</span>
                <button id="increment" onClick={clickHandler} >increment</button>
                 <button onClick={getLocationHandler}>getLocation</button>
                 <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} />
                 <button  onClick={submitHandler} >send</button>
            </div>
           
        </div>
    )
}
