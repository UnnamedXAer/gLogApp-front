import React from 'react';
import classes from './ExerciseMenu.module.css';

const exerciseMenu = (props) => {

    return (
        <div className={classes.ExerciseMenu}>
            <h2>What to do?</h2>
            <button onClick={props.clearExercise} >Change Exercise</button>
            <button onClick={props.clearExerciseAndSets} >Remove Exercise and Sets</button>
            <button onClick={props.doNothing} >Cancel</button>
        </div>
    );
}

export default exerciseMenu;