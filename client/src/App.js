import React from 'react'
import "./App.css";
import {BrowserRouter,Route,Switch} from "react-router-dom"
import Chat from "./components/chat/Chat";
import Form from "./components/Form"
export default function App() {
  return (
    <BrowserRouter>
    <Switch>
      <Route exact path="/">
        <Form/>
        </Route>
    <Route exact path="/chat/:username/:room">
      <Chat/>
    </Route>
    </Switch>
    </BrowserRouter>
   
  )
}


