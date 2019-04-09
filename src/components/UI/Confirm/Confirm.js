import React from 'react';
import classes from './Confirm.module.css';


const confirm = props => (
        <div className={classes.Confirm}>
            <p className={classes.Text}>{props.text}</p>
            <div className={classes.Buttons}>
                <button onClick={props.confirm}>Yes</button>
                <button onClick={props.reject}>No</button>
            </div>
        </div>
);


export default confirm;