import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';


function Header(){
    return(
    <div>
        <div className='header'>
            <a href="/">
                <img src={logo} alt="Pokemon Logo" style={{width: '100px', height: '100px'}} />
            </a>
            <Link to="/" style={{color: 'white'}}>Pokémons</Link> 
            <Link to="/moves" style={{color: 'white'}}>Moves</Link>
            <h1>Pokédex</h1>
        </div>
    </div>
    
    );
};

export default Header;