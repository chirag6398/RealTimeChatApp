import React,{useState} from 'react'
import { useHistory } from 'react-router'
import "../styles/form.scss";

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
        <div className="form__extDiv">
            <div className="form__container">
                <form onSubmit={submitHandler}>
                    <fieldset>
                        <legend>
                            <label>
                            Usename
                            </label>
                        </legend>
                        <input type="text" name="username" placeholder="your name" value={credentials?.username} autoComplete="off" required onChange={inputHandler}/>

                    </fieldset>
                    <fieldset>
                        <legend>
                        <label>
                            Room
                        </label>
                    </legend>
                            <input type="text" name="room" placeholder="enter room" value={credentials?.room} required autoComplete="off" onChange={inputHandler}/>
                    </fieldset>
                    <button type="submit">join</button>
                </form>
            </div>
        </div>
    )
}
