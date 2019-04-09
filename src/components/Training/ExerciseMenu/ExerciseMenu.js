import React from 'react';
import classes from './ExerciseMenu.module.css';

const exerciseMenu = (props) => {

    return (
        <div className={classes.ExerciseMenu}>
            <h2>What to do?</h2>
            <button onClick={props.clearExercise} >Clear Exercise</button>
            <button onClick={props.clearExerciseAndSets} >Clear Exercise and Sets</button>
            <button onClick={props.doNothing} >Do Nothing</button>
        </div>
    );
}

export default exerciseMenu;