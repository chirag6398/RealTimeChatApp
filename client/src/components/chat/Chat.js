import React,{useState,useEffect} from 'react';
import {io} from "socket.io-client";
import { useParams } from 'react-router';
import "../../styles/chat.scss";
export default function Chat() {
const [socket,setSocket]=useState(null);
const [message,setMessage]=useState("");
const [sending,setSending]=useState(false);
const [messages,setMessages]=useState([]);
const [locationLink,setLocationLink]=useState(undefined);
const {username,room}=useParams();





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
    socket?.on("messageArray",(msg,msgTime,username)=>{
        let tm=msgTime.split(':');
        let isDay=tm[2].split(' ');

        msgTime=`${tm[0]}:${tm[1]} ${isDay[1]}`;
        
        let newArray=messages;
        newArray.push({msg,msgTime,username});
      
        setMessages(newArray);
        console.log(messages)
        
    })

    socket?.emit('join',{username,room})

},[socket]);

// const clickHandler=()=>{
//     console.log("clicked");
//     socket.emit("increment")
// };

const getLocationHandler=()=>{
    if(!navigator.geolocation){
        console.log("can not access location");
    }else{
        navigator.geolocation.getCurrentPosition((position)=>{
             
             socket.emit("geoLocation",{
                Long:position.coords.longitude,
                Latit:position.coords.latitude,
                room,
                username
            })
        })
      
    }
}

const submitHandler=(e)=>{
    e.preventDefault();
    
    setSending(true);
    socket.emit("sendMessage",{message,room,username},(acknowledge)=>{
        setSending(false);
       
        console.log(`message has been ${acknowledge} successfully`);
    });
  
    setMessage("");

}
    return (
        <div className="chat__extDiv">
            <div className="chat__sideBar"></div>
            <div className="chat__msgPart">
          
                <div className="chat__messages">
                {messages?.map((value)=>{
                    return <div>{value.username}
                    <span>{value.msg} {value.msgTime}</span>
                    </div>
                })}
                {
                    locationLink?<a href={locationLink.toString()} target="_blank">The current Location</a>:null
                }
                </div>
                <div className="chat__msg__bottom">
                    <div className="chat__inputForm">
                    <form onSubmit={submitHandler} >
                 <input   type="text" placeholder="your message" value={message} onChange={(e)=>setMessage(e.target.value)} />
                 <button type="submit" disabled={sending} >{sending?"sending":"send"}</button>
                 </form>
                    </div>
               <div className="chat__locationButton">
               <button onClick={getLocationHandler}>getLocation</button>
               </div>
                
                </div>
                {/* <button id="increment" onClick={clickHandler} >increment</button> */}
                
                 
                
            </div>
            
           
           
        </div>
    )
}

