import React from 'react';
import classes from './MultiselectSelectBox.module.css';


const multiselectSelectBox = (props) => {

    const { focusedOption } = props;
    let options = <div className={classes.MultiselectSelectBoxElement + " " + classes.MultiselectSelectBoxPlaceholder} >No results</div>

    if (props.data.length > 0) {
        options = props.data.map((x, idx) => (
            <div className={classes.MultiselectSelectBoxElement + ((focusedOption === idx) ? ' ' + classes.MultiselectSelectBoxElementFocused : "")}
                onClick={(ev) => props.elementClicked(ev, x)}
                onMouseEnter={(ev) => props.mouseEntered(ev, idx)}
                ref={ref => props.setRef(ref, idx)}
                key={x.id} >
                {x.name}
            </div>
        ));
    }

    return (
        props.show ? <div className={classes.MultiselectSelectBox} 
            onBlur={props.blur} 
            tabIndex="0" 
            onFocus={props.focused}
            >
            {options}
        </div> 
        : null
    );
}

export default multiselectSelectBox;