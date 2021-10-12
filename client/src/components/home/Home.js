import React,{useState,useEffect} from 'react';
import {io} from "socket.io-client";

export default function Home() {
const [socket,setSocket]=useState(null);
useEffect(()=>{
    setSocket(io("ws://localhost:5000"));
},[]);

useEffect(()=>{
    socket?.on("countUpdated",(count)=>{
        console.log("the count has been updated",count);
    });

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
    return (
        <div>
            Chat App
            <button id="increment" onClick={clickHandler} >increment</button>
            <button onClick={getLocationHandler}>getLocation</button>
        </div>
    )
}
