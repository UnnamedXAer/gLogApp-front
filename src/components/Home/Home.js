import React from 'react';
import {Link} from 'react-router-dom';
import classes from './Home.module.css';
import RoundButton from '../UI/RoundButton/RoundButton';

const home = (props) => {

    return (
        <div className={classes.Home}>
            Home page <br /><br />
            <Link to="/Login" >Login</Link> <br /><br />
            <Link to="/registration">Registration</Link><br /><br />
            <Link to="/test-component">Test Component</Link>
            <br />
            <RoundButton 
                clicked={props.expand} 
                sign="plus"
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign="minus"
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign='tick'
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign='menuV'
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign="menuH"
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign="menu"
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign="question"
                float="right"
                />
            <RoundButton 
                clicked={props.expand} 
                sign="ok"
                float="right"
                />
        </div>
    );
}

export default home;