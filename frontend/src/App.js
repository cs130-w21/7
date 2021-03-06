// App.js
import React from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Pages/Home';
import Create from './components/Pages/Create';
import LogIn from './components/Pages/LogIn';
import Settings from "./components/Pages/Settings"
import SignUp from './components/Pages/SignUp';
import Recommend from './components/Pages/Recommend';

export default function App() {
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={LogIn}/>
          <Route path="/signup" exact component={SignUp}/>
          <Route path="/recommend" exact component={Recommend}/>
          <Route path="/create" exact component={Create}/>
          <Route path="/setting" component={Settings}/>
      </Switch>
    </Router>
    </>
  );
}