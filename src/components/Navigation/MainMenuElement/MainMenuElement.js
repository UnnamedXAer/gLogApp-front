import React from 'react';
import { NavLink } from 'react-router-dom'
import classes from './MainMenuElement.module.css';


const mainMenuElement = props => {
    let bgImg = "";
    try {
        bgImg = require('../../../img/'+props.path);
    }
    catch (exception) {
        bgImg = require('../../../img/icon1.png'); // default icon
    }
    const elStyle = {
        backgroundImage: 'url('+bgImg+')',
    };

    return (
        <button className={classes.MainMenuElement} style={elStyle} onClick={props.click}>
            <NavLink to={"/"+props.path} exact={props.exact} >{props.name}</NavLink>
        </button>
    );
}

export default mainMenuElement;