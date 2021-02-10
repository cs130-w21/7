// App.js
import React, { Component } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Pages/Home';
import LogIn from './components/Pages/LogIn';
import Settings from "./components/Pages/Settings"
import SignUp from './components/Pages/SignUp';
import Recommend from './components/Pages/Recommend';

class App extends Component {

  render() {
    return (
      <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={LogIn}/>
          <Route path="/signup" exact component={SignUp}/>
          <Route path="/recommend" exact component={Recommend}/>
          <Route exact path={'/setting'} component={Settings}/>
        </Switch>
      </Router>
        
      </>
    );
  }
}

export default App;