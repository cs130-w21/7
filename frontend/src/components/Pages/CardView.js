import React, { setState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button';

export default function CardView(props) {
  return (
    <>
      <li className='cards__item'>
        <Link className='cards__item__link' to={props.path}>
          <figure className='cards__item__pic-wrap' data-category={props.label}>
            <img
              className='cards__item__img'
              alt='Image'
              src={props.src}
            />
          </figure>
          <div className='cards__item__info'>
            <h5 className='cards__item__text'>{props.name}</h5>
            <h5 className='cards__item__text'>{props.location}</h5>
          </div>
        </Link>
      </li>
    </>
  );
}

