import React from 'react';
import classes from './Exercise.module.css';
import ButtonLink from '../../UI/ButtonLink/ButtonLink';

const exercise = props => {
    const exercise = props.exercise;

    let details = null;
    
    if (exercise.expanded) {
        details = exercise.sets.map(x => (
        <li key={x.id}>
            {x.weight}[kg] * {x.reps + " " + (exercise.setsUnit === 1 ? "" : "s")} - {x.time}
        </li>
    ))}

    return (
    <div className={classes.Exercise}>
        {exercise.name} {exercise.startTime} - {exercise.endTime} <ButtonLink clicked={props.expand}>{exercise.expanded ? "un-expand" : "expand"}</ButtonLink>
        <div className={classes.Sets}>
            {details}
        </div>
    </div>
    );
};

export default exercise;