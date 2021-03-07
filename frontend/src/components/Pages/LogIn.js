import React, { useState } from "react";
import '../../App.css';
import { Button } from '../Button';
import "../Login.css";
import Cookies from 'js-cookie';

export default function LogIn() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  var csrfCookie = Cookies.get('XSRF-TOKEN');
  console.log(csrfCookie)
  
  function validateForm() {
    return email.length > 0 && email.includes('@') && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function fetchToken(){
    return fetch('/api/login/', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body : JSON.stringify({
        email: email,
        password: password
      })
    }).then(response => response.json())
      .then(result => {
        localStorage.setItem('token', result.token);
        localStorage.setItem('email', email);
        localStorage.setItem('id', result.id);
    })
  }

  async function handleLogin() {
    await fetchToken();
    var token = localStorage.getItem('token');
    if (token === "undefined") {
      document.getElementById('warning').style.visibility = 'visible'
      document.getElementById('warning').textContent = 'User does not exist or incorrect password';
    }
    else {
      console.log("Successfully Loged In")
      localStorage.setItem('logIn', 1);
      document.getElementById('warning').style.visibility = 'hidden'
      window.location.href='/';
    }
  }

  function handleSignup() {
    window.location.href = '/signup';
  }

  return (
    <div className="LogIn">
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
        <Button id="login" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleLogin} disabled={!validateForm()} type="submit">LOG IN</Button>
        <div className='seperator' />
        <Button id="signup" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleSignup} type="submit">SIGN UP</Button>
        <div className='seperator' />
        <div id='warning' className='warning-text'>Wrong Password</div>
      </form>
    </div>
  );
}
