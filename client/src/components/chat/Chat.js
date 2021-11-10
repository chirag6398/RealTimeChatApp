import React,{useState,useEffect} from 'react';
import {io} from "socket.io-client";
import { useParams,useHistory } from 'react-router';
import "../../styles/chat.scss";
import { VscListFlat } from "react-icons/vsc";
export default function Chat() {
const [socket,setSocket]=useState(null);
const [message,setMessage]=useState("");
const [sending,setSending]=useState(false);
const [messages,setMessages]=useState([]);
const [roomName,setRoomName]=useState("");
const [isToggle,setIsToggle]=useState(false);
const [isMobileView,setIsMovileView]=useState(()=>{
    if(window.innerWidth<=670)return true;
    return false;
});
const [roomData,setRoomData]=useState();
const {username,room}=useParams();
const history=useHistory();


const windowSizeHandler=()=>{

    
    if(window.innerWidth<=670 && !isMobileView){
        setIsMovileView(true);
    }else if(window.innerWidth>670 && isMobileView){
        setIsMovileView(false);
        setIsToggle(false);
    }

   
}

useEffect(()=>{
    window.addEventListener("resize",windowSizeHandler);

    return ()=>{
        window.removeEventListener("resize",windowSizeHandler);
    }
},[windowSizeHandler])



useEffect(()=>{
    // setSocket(io("ws:https://real-time-chat-using-socket.herokuapp.com/"));
    setSocket(io(`http://${window.location.hostname}:5000`));
},[]);


useEffect(()=>{

    

    socket?.on("message",(message)=>{
        console.log(message);
    });

   

    socket?.on("roomData",({room,users})=>{
        setRoomData(users);
        setRoomName(room);
       
    })

   

    
    
    socket?.emit('join',{username,room},(error)=>{
        
        if(error){
           console.log(error);
           history.push('/')
        }
    });

    

},[socket]);



useEffect(()=>{

    socket?.on("sendLocationUrl",(url,msgTime,username)=>{
        
      
        let tm=msgTime.split(':');
        let isDay=tm[2].split(' ');

        msgTime=`${tm[0]}:${tm[1]} ${isDay[1]}`;
        
        
      
        setMessages([...messages,{url,msgTime,username}]);
        autoScroll();
    });

    socket?.on("messageArray",(msg,msgTime,username)=>{
        let tm=msgTime.split(':');
        let isDay=tm[2].split(' ');

        msgTime=`${tm[0]}:${tm[1]} ${isDay[1]}`;
        
        
      
        setMessages([...messages,{msg,msgTime,username}]);
        autoScroll();
       
        
    });

    console.log(messages);



},[socket,messages,setMessages]);






const getLocationHandler=()=>{
    if(!navigator.geolocation){
        console.log("can not access location");
    }else{
        navigator.geolocation.getCurrentPosition((position)=>{
             
             socket.emit("geoLocation",{
                Long:position.coords.longitude,
                Latit:position.coords.latitude
                
            })
        })
      
    }
}

const autoScroll=()=>{
  
    const messagePart=document.querySelector(".chat__messages");
    const newMessage=messagePart.lastElementChild;
   
    const newMessageHeight=newMessage.offsetHeight + 10;

    const visibleHeight=messagePart.offsetHeight;

    const containerHeight=messagePart.scrollHeight;

    const scrollOffset=messagePart.scrollTop+visibleHeight;

    if(containerHeight-newMessageHeight<=scrollOffset){
        messagePart.scrollTop=messagePart.scrollHeight;
    }


}
const toggleHandler=()=>{
    setIsToggle(!isToggle);
}
const submitHandler=(e)=>{
    e.preventDefault();
    
    setSending(true);
    socket.emit("sendMessage",{message,username},(acknowledge)=>{
        setSending(false);
       
        console.log(`message has been ${acknowledge} successfully`);
    });
  
    setMessage("");

}
    return (<div className="chatPage">
        {
            isMobileView?<div style={{padding:"10px"}}>
            <VscListFlat onClick={toggleHandler} className="toggleIcon" />
        </div>:null
        }
        <div className="chat__extDiv">
            {
                !isMobileView || isToggle?
                <div className="chat__sideBar">
                <div className="chat__sideBar__heading">
                    <p>{roomName}</p>
                </div>
                <div className="chat__sideBar__users">
                    {roomData?.map((data)=>{
                        let name=data.username;
                        if(data.username.length>=15){
                             name=data.username.substring(0,15);
                             name=name+"...";
                        }
                        return <div className="chat__sideBar__user">
                            <p className="chat__user">
                                {name}
                            </p>
                        </div>
                    })}
                </div>
             </div>:
             null
            }


            {
                !isToggle?
                <div className="chat__msgPart">
          
                <div className="chat__messages">
                {messages?.map((value)=>{
                    let name=value.username;
                    if(value.username.length>=15){
                         name=value.username.substring(0,15);
                         name=name+"...";
                    }
                    return <div className={value.username!=username?"message__box":"message__box message__box__right"} >{name}
                    {
                    value?.msg ? <p className="time__rightAlinged" style={{fontWeight:"800"}}>{value.msg}</p>:
                    <a href={value?.url} target="_blank"  >The current Location</a>
                    }
                    <p className="time__rightAlinged" style={{fontWeight:"bold",opacity:"0.7"}}>{value.msgTime}</p>
                    </div>
                })}
              
                </div>
                <div className="chat__msg__bottom">
                    <div className="chat__inputForm">
                    <form onSubmit={submitHandler} >
                 <input   type="text" placeholder="your message" value={message} onChange={(e)=>setMessage(e.target.value)} required />
                 <button type="submit" disabled={sending} >{sending?"sending":"send"}</button>
                 </form>
                    </div>
               <div className="chat__locationButton">
               <button onClick={getLocationHandler}>getLocation</button>
               </div>
                
                </div>
                
            </div>
                :null
            }
           
            
            
            
           
           
        </div>
    </div>
       
    )
}

