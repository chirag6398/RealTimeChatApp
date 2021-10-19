import React,{useState} from 'react'
import { useHistory } from 'react-router'
export default function Form() {
    const [credentials,setCredentials]=useState({});
    const history=useHistory();
    const inputHandler=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value});

    }
    const submitHandler=(e)=>{
        e.preventDefault();
        history.push(`/chat/${credentials.username}/${credentials.room}`);
    }
    return (
        <div>
            <form onSubmit={submitHandler}>
                <fieldset>
                <label>
                    Usename
                </label>
                <input type="text" name="username" placeholder="your name" value={credentials?.username} required onChange={inputHandler}/>
                </fieldset>
                <fieldset>
                <label>
                    Room
                </label>
                <input type="text" name="room" placeholder="enter room" value={credentials?.room} required onChange={inputHandler}/>
                </fieldset>
                <button type="submit">join</button>
            </form>
        </div>
    )
}
