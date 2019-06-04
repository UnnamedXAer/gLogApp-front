import React from 'react';
import Spinner from '../UI/Spinner/Spinner';
// import CloseArrow from '../UI/CloseArrow/CloseArrow';
import classes from './ExerciseDetails.module.css';
import Aux from '../../hoc/Auxiliary';

const exerciseDetails = (props) => (
    <div className={classes.ExerciseDetails}>
        {!props.exercise 
            ? <Spinner /> 
            : <Aux>
                <h4>{props.exercise.name}</h4>
                <div>
                    <h5>Description:</h5>
                    <p>{props.exercise.description}</p>
                    <div className={classes.PhotoWrapper}>
                        {props.photo ? <img className={classes.ImgPreview} src={props.photo} alt="Sample graphic"/> : null}
                    </div>
                    <div className={classes.CreatedWrapper}>
                        <div className={classes.Created}>
                            <h5>Created By:</h5>
                            <p>{props.exercise.createdBy}</p>
                        </div>
                        <div className={classes.Created}>
                            <h5>Created On:</h5>
                            <p>{new Date(props.exercise.createdOn).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            </Aux>}
    </div>
);

export default exerciseDetails;