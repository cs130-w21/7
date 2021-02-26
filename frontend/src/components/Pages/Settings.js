import React, { useState, useEffect, useContext } from 'react'
import { AppContext } from '../../App'

export default function Setting() {
    const {state} = useContext(AppContext);
    // const [profile, setProfile] = useState ({})

    useEffect(() => {
        var token = state.inputText;
        console.log(state)
        // console.log(token)
        if (token != null)
        {
            async function getClient() {
                await fetch('http://127.0.0.1:8000/api/profile/get/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`, 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      }, 
                }) // fetching the data from api, before the page loaded
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    // setProfile(data)
                })
            }
            getClient();
        }
        
    });

    return (
        <div>
            <h2>Public Profile</h2>
            <h3>This is Setting Page</h3>
        </div>
    );
      
}