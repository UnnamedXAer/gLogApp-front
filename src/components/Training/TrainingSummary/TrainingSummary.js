import React from 'react';
import Button from '../../UI/Button/Button';
import classes from './TrainingSummary.module.css';
import Aux from '../../../hoc/Auxiliary';
import Spinner from '../../UI/Spinner/Spinner';

const trainingSummary = (props) => {
    const exercises = props.exercises.map(ex => (<li key={ex.exercise.id}>{ex.exercise.name}</li>));
    return (
        <div className={classes.TrainingSummary}>
            <h3>Training Summary</h3>
            <div className={classes.TrainingTime}>
                <div>
                    Start: 
                    <input 
                        name="startTime"
                        type="datetime-local" 
                        value={props.startTime} 
                        onChange={props.timeOnChange} 
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        /> 
                </div>
                <div>
                    End: 
                    <input 
                        name="endTime"
                        type="datetime-local" 
                        value={props.endTime} 
                        onChange={props.timeOnChange} 
                        pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                        />
                </div>
            </div>
            <div>
                <ul>
                    {exercises}
                </ul>
            </div>
            {props.summaryMsg? <div className={classes.Error}>{props.summaryMsg}</div> : null}
            {props.loading ? <Spinner /> :
            <Aux>
                <Button btnType="Success" clicked={props.summaryCompleted} >Complete</Button>
                <Button btnType="Danger" clicked={props.summaryCanceled}>Cancel</Button>
            </Aux>}
            <div className={classes.TrainingComment}>
                <label htmlFor="comment">Training comment:</label>
                <textarea onChange={props.commentChanged} name="comment" value={props.comment} cols="35" rows="10"></textarea>
            </div>
        </div>
    );
}

export default trainingSummary;