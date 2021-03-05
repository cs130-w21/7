import React, { useState, useContext } from "react";
import '../../App.css';
import { Button } from '../Button';
import "../Login.css";
import DateTimePicker from 'react-datetime-picker';


export default function CreateEvent() {
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [datetime, setDatetime] = useState(new Date());
    const [description, setDescription] = useState("");

    function handleLogout() {
        localStorage.clear();
        window.location.href='/';
    }

    function createEvent() {
        const token = localStorage.getItem('token');
        Number.prototype.pad = function(size) {
            var s = String(this);
            while (s.length < (size || 2)) {s = "0" + s;}
            return s;
            }

        var day = datetime.getDate();
        var month = datetime.getMonth() + 1; //months are zero based
        var year = datetime.getFullYear();
        var time = datetime.toTimeString().split(" ")[0];
        var date = year + '-' + month.pad() + '-' + day.pad() + 'T' + time;
        fetch('http://127.0.0.1:8000/api/event/create_event/', {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Token '+token
            },
            body: JSON.stringify({
            "name": name,
            "location": location,
            "description": description,
            "datetime": datetime
            }),
        }).then(response => response.json())
            .then(result => {
                console.log(result);
                if(result["message"]=="Token expired" || result["detail"]=="Invalid token." ){
                    handleLogout();
                } else {
                    window.location.href='/event';
                }
        })
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit}>
            <div className='form-group login-attr' size="lg" id="name">
                <label>Event name</label>
                <input
                className='login-input'
                autoFocus
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='form-group login-attr' size="lg" id="location">
                <label>Location</label>
                <input
                className='login-input'
                type="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                />
            </div>
            <div className='form-group login-attr' size="lg" id="description">
                <label>Description</label>
                <input
                className='login-input'
                type="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className='form-group login-attr' size="lg" id="datetime">
                <label>Datetime</label>
                <div>
                    <DateTimePicker
                        onChange={setDatetime}
                        value={datetime}
                    />
                </div>
            </div>
            <Button id="create_event" buttonStyle="btn--outline--black" buttonSize="btn--full" onClick={createEvent} >CREATE EVENT</Button>
            <div className='seperator' />
            </form>
        </div>
    );
}

