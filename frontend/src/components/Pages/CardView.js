import React, { setState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';

export default function CardView(props) {
  if(props.name != undefined) {
      return (
        <>
          <li className='cards__item'>
            <Link className='cards__item__link' to={props.path}>
              <div className='cards__item__info'>
                <h3 className='cards__item__text'>Title : {props.name}</h3><br/>
                <h5 className='cards__item__text'>Location : {props.location}</h5><br/>
                <h5 className='cards__item__text'>Date : {props.datetime}</h5><br/>
                <h5 className='cards__item__text'>Description : {props.description}</h5><br/>
                <h5 className='cards__item__text'>Attendees : {props.attendee.map(attendee => (
                                    attendee+" "
                                ))}</h5><br/>
              </div>
            </Link>
          </li>
        </>
      );
  } else {
    return (
      <>
        <li className='cards__item'>
          <Link className='cards__item__link' to={props.path}>
            <figure className='cards__item__pic-wrap' data-category={props.label}>
              <img
                className='cards__item__img'
                alt='Travel Image'
                src={props.src}
              />
            </figure>
            <div className='cards__item__info'>
              <h5 className='cards__item__text'>{props.text}</h5>
            </div>
          </Link>
        </li>
      </>
    );
  }
}

