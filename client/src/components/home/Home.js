import React,{useState,useEffect,useRef} from 'react';
import {io} from "socket.io-client";
import "../../styles/home.scss";
export default function Home() {
const [socket,setSocket]=useState(null);
const [message,setMessage]=useState("");
const [sending,setSending]=useState(false);

let inputField=useRef(null);
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

const submitHandler=(e)=>{
    e.preventDefault();
    
    setSending(true);
    socket.emit("sendMessage",message,(acknowledge)=>{
        setSending(false);
        console.log(inputField)
        // inputField.current.focus();
        console.log(`message has been ${acknowledge} successfully`);
    });
  
    setMessage("");

}
    return (
        <div className="home__extDiv">
            <div className="home__mainDiv">
                <span>Chat App</span>
                <button id="increment" onClick={clickHandler} >increment</button>
                 <button onClick={getLocationHandler}>getLocation</button>
                 <form onSubmit={submitHandler} >
                 <input ref={(el)=>inputField=el}  type="text" value={message} onChange={(e)=>setMessage(e.target.value)} />
                 <button type="submit" disabled={sending} >{sending?"sending":"send"}</button>
                 </form>
                
            </div>
           
        </div>
    )
}
