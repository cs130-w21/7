// App.js
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import Settings from "./components/Pages/Settings"
import Home from "./components/Pages/Home"

class App extends Component {

  constructor(){
    super();
    this.state = {user:null}
  }
  render() {    
    if (this.state.user != null) {
      // return <Login/>;
    }else { 
      return (
        <Router>
          <div id="routeDiv">
            <Switch>
              <Route path="/">
                <Main />
              </ Route>
            </Switch>
          </div>
        </Router>
      );
    } 
  }
}

function Main() {
  return(
    <Router>
      <React.Fragment>
          <Switch>
              <Route exact path={'/'} render={() => {
                  return <Redirect to={'/home'}/>
              }}/>
              <Route exact path={'/home'} component={Home}/>
              <Route exact path={'/setting'} component={Settings}/>
          </Switch>
      </React.Fragment>
    </Router>
  )
}

// function Login(){
//   function onSubmit() {
//     return  <Redirect to="/home"/>
//  }
//   return (
//     <div className="app">
//       <h1>Welcome to YummY</h1>
//       <h2>This is Login Page</h2>
//       <button onClick={onSubmit}>Login</button>
//     </div>
//   )
// }


export default App;