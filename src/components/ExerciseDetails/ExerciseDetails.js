import React from 'react';

// import CloseArrow from '../UI/CloseArrow/CloseArrow';
import classes from './ExerciseDetails.module.css';

const exerciseDetails = (props) => (
    <div className={classes.ExerciseDetails}>
        <h4>{props.exercise.name}</h4>
        <div>
            <h5>Description:</h5>
            <p>{props.exercise.description}</p>
            
            <div className={classes.CreatedWraper}>
                <div className={classes.Created}>
                    <h5>Created By:</h5>
                    <p>{props.exercise.createdby}</p>
                </div>
                <div className={classes.Created}>
                    <h5>Created On:</h5>
                    <p>{props.exercise.createdon}</p>
                </div>
            </div>
        </div>
    </div>
);

export default exerciseDetails;