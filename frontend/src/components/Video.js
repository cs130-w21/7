import React, {useState, useEffect} from 'react';
import '../App.css';
import { Button } from './Button';
import './Video.css';



function Video() {
  const [count, setCount] = useState(0);
  const [loginBool, setLoginBool] = useState(0);

  useEffect(()=>{
    var loginTemp = localStorage.getItem('logIn');
    setLoginBool(loginTemp);
  })

  function openRestaurant() {
    if(loginBool == 1) {
      window.location.href='/recommend';
    } else {
      window.location.href='/login';
    }
  }


  function showButtonOption(){
    if(loginBool == 1) {
      setCount(1);
    } else {
      console.log("login")
      // window.location.href='/login';
    }
   
  }

  return (
    <div className='video-container'>
      <video src='/videos/video.mp4' autoPlay loop muted />
      <h1>YummY</h1>
      <p>Let us decide for you</p>
      
      {count === 0 ?
          <div className='video-btns'>
          <Button
            id="bt"
            className='btns'
            buttonStyle='btn--primary'
            buttonSize='btn--large'
            onClick={showButtonOption}
          >
            FIND A RESTAURANT
          </Button>
        </div>
        :
        <div className='video-btns'>
         <Button
           id="bt1"
           className='btns'
           buttonStyle='btn--primary'
           buttonSize='btn--large'
           onClick={openRestaurant}
         > Individual
         </Button>
         <Button
           id="bt2"
           className='btns'
           buttonStyle='btn--primary'
           buttonSize='btn--large'
           onClick={openRestaurant}
         > Group 
         </Button>
       </div>
      }
     
    </div>
  );
}

export default Video;