import React from 'react';

import classes from './RoundButton.module.css';

const roundButton = (props) => {
    let buttonClasses = [classes.RoundButton];

    switch (props.sign) {
        case 'minus':
            buttonClasses.push(classes.BeforeMinus);
            break;
        case 'ok':
            buttonClasses.push(classes.BeforeOK);
            break;
        case 'tick':
            buttonClasses.push(classes.BeforeTick);
            break;
        case 'question':
            buttonClasses.push(classes.BeforeQuestion);
            break;
        case 'menuV':
            buttonClasses.push(classes.BeforeMenuV);
            break;
        case 'menuH':
            buttonClasses.push(classes.BeforeMenuH);
            break;
        case 'menu':
            buttonClasses.push(classes.BeforeMenu);
            break;
        default: // "plus"
            buttonClasses.push(classes.BeforePlus);
            break;
    }

    const size = props.size ? (props.size+"px") : "25px"; 
    return (
        <div className={buttonClasses.join(' ')}
            style={{
                width: size,
                height: size,
                fontSize: size,
                backgroundColor: props.bgColor ? props.bgColor : 'black', //'rgb(44,108,128)',
                //color: props.fgColor ? props.fgColor : 'white', // doesn't work with ::before
                float: props.float ? props.float : 'left',
            }}
            onClick={props.clicked}
        ></div>
    );
}
export default roundButton;