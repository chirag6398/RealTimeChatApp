import React,{useState,useEffect} from 'react';
import {io} from "socket.io-client";
import "../../styles/home.scss";
export default function Home() {
const [socket,setSocket]=useState(null);
const [message,setMessage]=useState("");
const [sending,setSending]=useState(false);
const [messages,setMessages]=useState([]);
const [locationLink,setLocationLink]=useState(undefined);
useEffect(()=>{
    setSocket(io("ws://localhost:5000"));
},[]);

useEffect(()=>{

    socket?.on("countUpdated",(count)=>{
        console.log("the count has been updated",count);
    });

    socket?.on("message",(message)=>{
        console.log(message);
    });

    socket?.on("sendLocationUrl",(url)=>{
        setLocationLink(url);
    })
    socket?.on("messageArray",(msg,msgTime)=>{
        let newArray=messages;
        newArray.push({msg,msgTime});
        console.log(newArray)
        setMessages(newArray);
        
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
       
        console.log(`message has been ${acknowledge} successfully`);
    });
  
    setMessage("");

}
    return (
        <div className="home__extDiv">
            <div className="home__sideBar"></div>
            <div className="home__msgPart">
          
                <div className="home__messages">
                {messages?.map((value)=>{
                    return <span>{value.msgTime}- {value.msg}</span>
                })}
                {
                    locationLink?<a href={locationLink.toString()} target="_blank">The current Location</a>:null
                }
                </div>
                <div className="home__msg__bottom">
                    <div className="home__inputForm">
                    <form onSubmit={submitHandler} >
                 <input   type="text" placeholder="your message" value={message} onChange={(e)=>setMessage(e.target.value)} />
                 <button type="submit" disabled={sending} >{sending?"sending":"send"}</button>
                 </form>
                    </div>
               <div className="home__locationButton">
               <button onClick={getLocationHandler}>getLocation</button>
               </div>
                
                </div>
                {/* <button id="increment" onClick={clickHandler} >increment</button> */}
                
                 
                
            </div>
            
           
           
        </div>
    )
}
