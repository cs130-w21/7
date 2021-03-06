import React, { useState } from "react";
import '../../App.css';
import { Button } from '../Button';
import "../Login.css";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return email.length > 0 && email.includes('@') && password.length > 0 && username.length > 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
  }

  // function handleLogin() {
  //     console.log(email);
  //     var user_exist = false;
  //     if(!user_exist){
  //       document.getElementById('warning').style.visibility = 'visible';
  //       document.getElementById('warning').textContent = 'User does not exist';
  //     } else {
  //       document.getElementById('warning').style.visibility = 'hidden';
  //     }
  //     //TODO : login API
  // }

  
  function parseJSON(response) {
    return response.json();
  }
  
  function handleSignup () {
    //TODO : Sign Up API
    fetch('/api/register/', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
            username: username
        })
    }).then(parseJSON)
    .then(function(data) {
        if("response" in data) {
            if(data.response === "Successfully registered a new user."){
                console.log(data)
                localStorage.logIn = 1;
                localStorage.token = data.token;
                window.location.href='/create';
            } else {
                document.getElementById('warning').style.visibility = 'visible'
                document.getElementById('warning').textContent = data.response;
            }
        } else {
            document.getElementById('warning').style.visibility = 'visible'
            if("email"in data){
                document.getElementById('warning').textContent = data.email[0];
            } else if("password" in data) {
                document.getElementById('warning').textContent = data.password[0];
            } else if("username" in data){ 
                document.getElementById('warning').textContent = data.username[0];
            } else
                document.getElementById('warning').textContent = "Valid inputs required"
        }
    }).catch(function(error) {
      console.log('request failed', error)
    });
      

}

  return (
    <div className="SignUp">
      <form onSubmit={handleSubmit}>
        <div className='form-group login-attr' size="lg">
          <label>Email</label>
          <input
            className='login-input'
            autoFocus
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='form-group login-attr' size="lg">
          <label>Username</label>
          <input
            className='login-input'
            type="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className='form-group login-attr' size="lg">
          <label>Password</label>
          <input
            className='login-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button id="signup" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={handleSignup} type="submit" disabled={!validateForm()}>SIGN UP</Button>
        <div className='seperator'/>
        <div id='warning' className='warning-text'>Wrong Password</div>
      </form>
    </div>
  );
}
