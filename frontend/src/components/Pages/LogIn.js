import React, { useState, useContext } from "react";
import '../../App.css';
import { Button } from '../Button';
import "../Login.css";
import { AppContext } from '../../App'

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {dispatch} = useContext(AppContext);

  const changeInputValue = (newValue) => {
    dispatch({ type: 'UPDATE_INPUT', data: newValue,});
  };

  function validateForm() {
    return email.length > 0 && email.includes('@') && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleLogin() {
    function getData() {
      fetch('http://127.0.0.1:8000/api/login/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password": password
        }),
      }).then(response => response.json())
        .then(result => {
          console.log(result.token)
          changeInputValue(result.token)
          // localStorage.setItem('token', result.token);
          // localStorage.token = result.token;
        })

    }
    getData();

    var token = localStorage.getItem('token');

    if (token == null) {
      document.getElementById('warning').style.visibility = 'visible'
      document.getElementById('warning').textContent = 'User does not exist';
    } else {
      console.log("Successfully Loged In")
      localStorage.logIn = 1;
      // setTimeout(function () {
      //   window.location.href = '/';
      // }, 3000);
      // 
      document.getElementById('warning').style.visibility = 'hidden'
    }
    // //TODO : login API
    // localStorage.logIn = 1;
    // window.location.href='/';
  }

  function handleSignup() {
    window.location.href = '/signup';
  }

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <div className='form-group login-attr' size="lg" id="email">
          <label>Email</label>
          <input
            className='login-input'
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group login-attr' size="lg" id="password">
          <label>Password</label>
          <input
            className='login-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button id="login" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleLogin} disabled={!validateForm()}>LOG IN</Button>
        <div className='seperator' />
        <Button id="signup" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleSignup} type="submit">SIGN UP</Button>
        <div className='seperator' />
        <div id='warning' className='warning-text'>Wrong Password</div>
      </form>
    </div>
  );
}

