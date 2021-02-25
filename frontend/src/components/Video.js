import React, {useState} from 'react';
import '../App.css';
import { Button } from './Button';
import './Video.css';

function openRestaurant() {
  if(localStorage.logIn == 1) {
    window.location.href='/recommend';
  } else {
    window.location.href='/login';
  }
}

function Video() {
  const [count, setCount] = useState(0);
  
  function showButtonOption(){
    setCount(1)
  }

  return (
    <div className='video-container'>
      <video src='/videos/video.mp4' autoPlay loop muted />
      <h1>YummY</h1>
      <p>Let us decide for you</p>
      
      {count == 0 ?
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