// App.js
import React, { Component } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Pages/Home';
import Create from './components/Pages/Create';
import LogIn from './components/Pages/LogIn';
import Settings from "./components/Pages/Settings"

class App extends Component {

  render() {
    return (
      <>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home}/>
          {/* <Route path="/restaurants" exact component={Restaurants}/> */}
          <Route path="/login" exact component={LogIn}/>
          <Route path="/create" exact component={Create}/>
          <Route exact path={'/setting'} component={Settings}/>
        </Switch>
      </Router>
        
      </>
    );
  }
}

export default App;