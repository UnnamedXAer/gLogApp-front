import React from 'react';
import classes from './Exercise.module.css';

const exercise = props => {
    const exercise = props.exercise;

    let details = null;
    
    if (exercise.expanded) {
        details = <div className={classes.Sets}>
            <ul>
                {exercise.sets.map(x => (
                    <li key={x.id}>
                        {x.weight}[kg] * {x.reps + " " + (exercise.setsUnit === 1 ? "" : "s")} - {x.time}
                    </li>
                ))}
            </ul>
        </div>
    }

    const startTime = new Date(exercise.startTime);
    const endTime = new Date(exercise.endTime);
    const diffTime = new Date(endTime.getTime() - startTime.getTime());

    return (
        <div className={classes.Exercise}>
            <div className={classes.Header} onClick={props.expand}>
                <div className={classes.Info}>
                    {exercise.name} 
                    {startTime.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false })} 
                    - {endTime.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false })} 
                    ({diffTime.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false })} )
                </div>
                <div className={classes.ExpandSign}>
                    {exercise.expanded ? "-" : "+"}
                </div>
            </div>
            {details}
    </div>
    );
};

export default exercise;