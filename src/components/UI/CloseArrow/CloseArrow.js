import React from 'react';
import classes from './CloseArrow.module.css';

const closeArrow = (props) => (
    <div className={classes.CloseArrow} onClick={props.closePanel}>&#8592;</div>
);

export default closeArrow;