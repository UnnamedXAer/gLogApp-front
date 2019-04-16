import React from 'react';
import {Link} from 'react-router-dom';
import classes from './Home.module.css';
import Form from '../../junk/From';


const home = (props) => {

    return (
        <div className={classes.Home}>
            Home page <br />
            <Link to="/Login" >Login</Link>
            <Link to="/registration">Registration</Link>
            <Form />
        </div>
    );
}

export default home;