import React from 'react';
import  classes from './MultiselectInput.module.css';


const multiselectInput = React.forwardRef((props, ref) => {

    return (
        <input className={classes.MultiselectInput} type="text" 
            value={props.inputValue} 
            onChange={props.inputValueChanged}
            onBlur={props.blur}
            ref={ref}
            onKeyDown={props.keyDown} />
    );
});

export default multiselectInput;