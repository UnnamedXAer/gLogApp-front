import React from 'react';

import classes from './RoundButton.module.css';

const roundButton = (props) => {

    const types = {
        plus: {
            sign: '+',
            fontSize: "0.9em"
        },
        minus: {
            sign: '-',
            fontSize: "0.9em"
        },
        ok: {
            sign: 'OK',
            fontSize: "0.6em"
        },
        tick: {
            sign: '✔',
            fontSize: "0.8em"
        },
        question: {
            sign: '?',
            fontSize: "0.7em"
        },
        menuH: {
            sign: '…',
            fontSize: "0.8em"
        },
        menuV: {
            sign: '⋮',
            fontSize: "0.7em"
        },
        menu: {
            sign: '≡',
            fontSize: "0.8em"
        },
    }

    const size = props.size ? (props.size) : 25; 
    return (
        <button className={classes.RoundButton}
            style={{
                width: size+"px",
                height: size+"px",
                fontSize: types[props.sign || 'plus'].fontSize,
                backgroundColor: props.bgColor ? props.bgColor : 'black', //'rgb(44,108,128)',
                color: props.fgColor ? props.fgColor : 'white', // doesn't work with ::before
                float: props.float ? props.float : 'left',
            }}
            onClick={props.clicked}
        >{types[props.sign || 'plus'].sign}</button>
    );
}
export default roundButton;