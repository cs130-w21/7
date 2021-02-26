import React from 'react'



export default function LogOut(){
    localStorage.clear();
    window.location.href='/';
 
}

