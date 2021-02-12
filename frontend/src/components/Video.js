import React from 'react';
import '../App.css';
import { Button } from './Button';
import './Video.css';

function openRestaurant() {
  if(localStorage.logIn === 1) {
    window.location.href='/recommend';
  } else {
    window.location.href='/login';
  }
}

function Video() {
  return (
    <div className='video-container'>
      <video src='/videos/video.mp4' autoPlay loop muted />
      <h1>YummY</h1>
      <p>Let us decide for you</p>
      <div className='video-btns'>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={openRestaurant}
        >
          FIND A RESTAURANT
        </Button>
      </div>
    </div>
  );
}

export default Video;