import React from 'react';
import { Link } from 'react-router-dom';
import classes from './UnAuthorized.module.css';

const unAuthorized = (props) => (
    <div className={classes.UnAuthorized}>
        <h3><i>An-Authorized access</i></h3>
        <div>Please </div><Link to="/Login" >login</Link> or <Link to="/registration">register</Link> new account.
    </div>
);

export default unAuthorized;