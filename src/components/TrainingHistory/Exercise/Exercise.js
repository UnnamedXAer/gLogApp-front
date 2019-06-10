import React from 'react';
import classes from './Exercise.module.css';

const exercise = props => {
    const exercise = props.exercise;

    let details = null;
    
    if (exercise.expanded) {
        details = <div className={classes.Sets}>
            <ol>
                {exercise.sets.map(x => (
                    <li key={x.id}>
                        {1*x.weight}<span className={classes.Unit}>[kg]</span> * {x.reps}
                        {exercise.setsUnit === 1 ? "" : (<span className={classes.Unit}>[s]</span>)} - {new Date(x.time).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false, second: '2-digit' })}
                    </li>
                ))}
            </ol>
        </div>
    }

    const startTime = new Date(exercise.startTime);
    const endTime = new Date(exercise.endTime);
    const diffTime = new Date(endTime.getTime() - startTime.getTime());

    return (
        <div className={classes.Exercise}>
            <div className={classes.Header} onClick={props.expand}>
                <div className={classes.Info}>
                    <div className={classes.InfoName}>{exercise.name}</div>
                    <div className={classes.InfoTime}>{ " " +
                                startTime.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false }) +
                        " - " + endTime.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false }) +
                        " ("  + diffTime.toLocaleString('en-us', { hour: '2-digit', minute: '2-digit', hour12: false })+ ")"}
                    </div>
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