import React from 'react';
import classes from './SelectedElement.module.css';


const selectedElement = (props) => {
    return <span className={classes.SelectedElement}>
            <div className={classes.SelectedElementRemove} onClick={(ev) => props.removeClicked(ev, props.id)}>×</div>
            <div className={classes.SelectedElementValue}>{props.name}</div>
        </span>
}

export default selectedElement;