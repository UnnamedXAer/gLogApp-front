import React from 'react';
import classes from './ButtonLink.module.css';

const buttonLink = props => <button className={classes.ButtonLink} onClick={props.clicked} >{props.children}</button>;

export default buttonLink;