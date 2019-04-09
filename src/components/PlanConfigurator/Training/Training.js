import React from 'react';
import classes from './Training.module.css';

import ExerciseLookup from '../../../containers/ExerciseLookup/ExerciseLookup';
import Exercise from '../Exercise/Exercise';

const training = (props) => {
    let exerciseLookup = null;
        if (props.showLookup) {
            exerciseLookup =<ExerciseLookup closed={props.toggleExerciseLookup} />
        }


    let exercises = props.training.exercises.map(x => (
        <Exercise 
            higlight={x.id === props.higlightedExerciseId} 
            inEdit={x.id === props.editeExerciseId}
            key={x.id}
            exercise={x} 
            inputChanged={props.exerciseInputChangeed}
            newSet={props.newSet}
            addSet={props.addSet}
            setInputBlured={props.setInputBlured}
            clicked={props.exerciseClicked}
            newSetRef={props.newSetRef}
            />
    ));

    return (
        <div className={classes.Training}>
            {exerciseLookup}
            {exercises}
            <div key={-1}><button onClick={props.toggleExerciseLookup}>Add</button></div>
        </div>
    );
}


export default training;