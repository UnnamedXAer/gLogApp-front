import React from 'react';
import classes from './Input.module.css';


const input = props => <input 
    className={classes.Input}
    type={props.type}
    name={props.name}
    placeholder={props.placeholder}
    value={props.value}
    onChange={props.changed}
    onBlur={props.blurred}
    required={props.required}
    pattern={props.pattern}
    onFocus={props.focused} />;


export default input;