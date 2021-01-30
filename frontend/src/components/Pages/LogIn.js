import React, { useState } from "react";
import '../../App.css';
import { Button } from '../Button';
import "../Login.css";
import globalVal from '../../globalVal'

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
      console.log(email);
      var user_exist = false;
      if(!user_exist){
        globalVal.logIn = true;
        document.getElementById('warning').style.visibility = 'visible'
        document.getElementById('warning').textContent = 'User does not exist';
      } else {
        document.getElementById('warning').style.visibility = 'hidden'
      }
      //TODO : login API
  }

  function handleSignup () {
    console.log(password);
    //TODO : Sign Up API
}

  return (
    <div className="Login">
      <form onSubmit={handleSubmit}>
        <div className='form-group login-attr' size="lg" controlId="email">
          <label>Email</label>
          <input
            className='login-input'
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div class='form-group login-attr' size="lg" controlId="password">
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
        <Button id="signup" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleSignup} type="submit" disabled={!validateForm()}>SIGN UP</Button>
        <div className='seperator'/>
        <div id='warning' className='warning-text'>Wrong Password</div>
      </form>
    </div>
  );
}
