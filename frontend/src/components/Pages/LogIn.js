import React, { useState } from "react";
import '../../App.css';
import { Button } from '../Button';
import "../Login.css";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && email.includes('@') && password.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  function handleLogin() {
      var user_exist = true;
      if(!user_exist){
        document.getElementById('warning').style.visibility = 'visible'
        document.getElementById('warning').textContent = 'User does not exist';
      } else {
        document.getElementById('warning').style.visibility = 'hidden'
      }
      //TODO : login API
      localStorage.logIn = 1;
      window.location.href='/';
  }

  function handleSignup () {
    window.location.href='/signup';
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
        <div className='seperator'/>
        <Button id="signup" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleSignup} type="submit">SIGN UP</Button>
        <div className='seperator'/>
        <div id='warning' className='warning-text'>Wrong Password</div>
      </form>
    </div>
  );
}
