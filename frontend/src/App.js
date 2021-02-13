// App.js
import React, { useReducer } from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import './App.css';
import Home from './components/Pages/Home';
import Create from './components/Pages/Create';
import LogIn from './components/Pages/LogIn';
import Settings from "./components/Pages/Settings"
import SignUp from './components/Pages/SignUp';
import Recommend from './components/Pages/Recommend';

// Create context object
export const AppContext = React.createContext();
// Set up Initial State
const initialState = {
    inputText: '',
};

function reducer(state, action) {
    switch (action.type) {
        case 'UPDATE_INPUT':
            return {
                inputText: action.data
            };
        default:
            return initialState;
    }
}
export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(state)
  return (
    <>
    <Router>
      <Navbar />
      <Switch>
        <AppContext.Provider value={{ state, dispatch }}>
          <Route path="/" exact component={Home}/>
          <Route path="/login" exact component={LogIn}/>
          <Route path="/signup" exact component={SignUp}/>
          <Route path="/recommend" exact component={Recommend}/>
          <Route path="/create" exact component={Create}/>
          <Route path="/setting" component={Settings}/>
        </AppContext.Provider>
      </Switch>
    </Router>
      
    </>
  );
}