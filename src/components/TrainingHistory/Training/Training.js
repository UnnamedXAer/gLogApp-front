import React from 'react';
import classes from './Training.module.css';
import ButtonLink from '../../UI/ButtonLink/ButtonLink';
import Exercise from '../Exercise/Exercise';

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
            <p key={1}>{startTime.getDate()} {startTime.toLocaleString('en-us', { month: 'long' })} {startTime.getFullYear()} 
                <ButtonLink clicked={props.expand}>{training.expanded ? "-" : "+"}</ButtonLink>
            </p>
            {details}
        </div>
    );
};

export default training;