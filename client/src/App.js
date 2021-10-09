import React from 'react'
import "./App.css";
import {BrowserRouter,Route,Switch} from "react-router-dom"
import Home from "./components/home/Home";
export default function App() {
  return (
    <BrowserRouter>
    <Switch>
    <Route exact path="/">
      <Home/>
    </Route>
    </Switch>
    </BrowserRouter>
   
  )
}


