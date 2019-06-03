import React from 'react';
import classes from './Training.module.css';
import Exercise from '../Exercise/Exercise';
import RoundButton from '../../UI/RoundButton/RoundButton';

const training = props => {

    console.log(props.training)
    const training = props.training;
    const startTime = new Date(training.startTime);

    let details = null;
    
    if (training.expanded) {
        details = <div className={classes.Details}>
            {training.exercises.map(x => <Exercise expand={(ev) => props.expandExercise(ev, training.id, x.id)} key={x.id} exercise={x}/>)}
        </div>;
    }

    return (
        <div className={classes.Training} >
            <div className={classes.Header} onClick={props.expand}>
                <RoundButton 
                    clicked={props.expand} 
                    size='30'
                    sign={training.expanded ? "minus" : "plus"}
                    float="right"
                    bgColor="white"
                    fgColor="black"
                     />
                <p>{startTime.getDate()} {startTime.toLocaleString('en-us', { month: 'long' })} {startTime.getFullYear()} </p>
            </div>
            {details}
        </div>
    );
};

export default training;