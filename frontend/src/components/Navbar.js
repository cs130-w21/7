import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import { Button } from './Button';
import './Navbar.css';

function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [token, setToken] = useState("")

    useEffect(() => {
        showButton()
        var getToken = localStorage.getItem('token');
        setToken(getToken)
    }, []);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const btnHandler = () => {
        if(localStorage.logIn == 1) {
            window.location.href='/setting';
        } else 
            window.location.href='/login';
    }

    const deleteAuth= () =>{
        if (token != null)
        {
            return fetch('/api/logout/', {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            }).then(response => console.log("User loged out",response.json()))
        }
    }

    const handleLogout = async () =>{
        await deleteAuth();
        localStorage.clear();
        window.location.href='/';
    }

    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }

    window.addEventListener('resize', showButton);

    if(localStorage.logIn == 1) {
        return (
            <>
              <nav className="navbar">
                  <div className="navbar-container">
                    <Link to="/" className="navbar-logo" onClick=
                    {closeMobileMenu}>
                        YummY
                    </Link>
                    <div className="menu-icon" onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-item'>
                            <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                                Home
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/recommend' className='nav-links' onClick={closeMobileMenu}>
                                Restaurants
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/event' className='nav-links' onClick={closeMobileMenu}>
                                Events
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/create' className='nav-links' onClick={closeMobileMenu}>
                                Create
                            </Link>
                        </li>
                        <li className='nav-item'>
                            <Link to='/setting' className='nav-links' onClick={closeMobileMenu}>
                                Profile
                            </Link>
                        </li>
                    </ul>
                    {button && <Button id='login-btn' buttonStyle='btn--outline' onClick={handleLogout}>Log Out</Button>}
                  </div>
              </nav>  
            </>
        )
    } else 
        return (
        <>
          <nav className="navbar">
              <div className="navbar-container">
                <Link to="/" className="navbar-logo" onClick=
                {closeMobileMenu}>
                    YummY
                </Link>
                <div className="menu-icon" onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                            Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
                            Restaurants
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
                            Event
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/login' className='nav-links' onClick={closeMobileMenu}>
                            Profile
                        </Link>
                    </li>
                    {/* <li id='login-btn-mob' className='nav-item'>
                        <Link to='/login' className='nav-links-mobile' onClick={closeMobileMenu}>
                            Log In
                        </Link>
                    </li> */}
                </ul>
                {button && <Button id='login-btn' buttonStyle='btn--outline' onClick={btnHandler}>LOG IN</Button>}
              </div>
          </nav>  
        </>
    )
}

export default Navbar