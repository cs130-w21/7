import React from 'react';
import '../../App.css';
import Video from '../Video';
import globalVal from '../../globalVal'

function Home() {
    console.log(globalVal.logIn);
    return (
        <>
            <Video />
        </>
    );
}

export default Home;