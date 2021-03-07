import React, { setState } from 'react';
import { Link } from 'react-router-dom';

export default function EventView(props) {
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
}

