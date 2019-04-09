import React from 'react';
import classes from './DrawerToggle.module.css';

const drawerToggle = props => (
    <div onClick={props.click} className={classes.DrawerToggle} aria-haspopup="true" >
        <div></div>
        <div></div>
        <div></div>
    </div>
);

export default drawerToggle;