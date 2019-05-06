import React from 'react';
import classes from './Alert.module.css';
import Modal from '../Modal/Modal';


const alert = props => {
    let color = 'black';
    switch (props.type) {
        case 'info':
            color= 'blue';
            break;
        case 'warn':
            color= 'orange';
            break;
        case 'error':
            color= 'red';
            break;
        default:
            break;
    }
    return (
        <Modal show={props.show} >
            <div className={classes.Alert}>
                <span style={{content: '&#9888'/*"\26A0"*/, color}}>{props.type}</span>
                <p className={classes.Text}>{props.text}</p>
                <div className={classes.Buttons}>
                    <button onClick={props.confirm}>Ok</button>
                </div>
            </div>
        </Modal>
    );
};


export default alert;