import React from 'react';
import Button from '../../UI/Button/Button';
import classes from './TrainingMenu.module.css';


const trainingMenu = props => {


    return (<div className={classes.TrainingMenu}>
        <Button clicked={props.showComment} btnType="Normal">Show Comment</Button>
        <Button clicked={props.showChart} btnType="Normal">Show Chart</Button>
    </div>);
}

export default trainingMenu;