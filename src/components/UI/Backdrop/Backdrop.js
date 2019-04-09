import React from 'react';
import classes from './Backdrop.module.css';

const backdrop = (props) => ( // screen mask
    props.show ? <div 
        className={classes.Backdrop} 
        style={{zIndex: props.zIndex? props.zIndex : 100}}
        onClick={props.clicked}>
    </div> : null
);

export default backdrop;