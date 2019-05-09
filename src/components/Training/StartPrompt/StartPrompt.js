import React from 'react';
import { Link } from 'react-router-dom';
import classes from './StartPrompt.module.css';
import Modal from '../../UI/Modal/Modal';

const startPrompt = props => {

    let trainings = null; 
    if (props.trainings) {
        trainings = <ol>
                {props.trainings.map((training,index) => <li key={index} onClick={(ev) => props.trainingSelected(ev, training.id)}>{training.startTime}</li>)}
            </ol>
    }
    return (
        <Modal 
            show={props.show}
            width="86"
            height="76"
            overflow="auto"
             >
            <div className={classes.StartPrompt}>
                {trainings? <div className={classes.SavedTrainings}>
                        <h4>The following trainings are not completed select one of them or start new.</h4> 
                        {trainings.length > 1 ? <p>You should go to <Link to="/training-history">Training History</Link> and fix uncompleted trainings.</p> : null}
                        {trainings}
                    </div>: null}
                <div className={classes.Buttons}>
                    <button onClick={props.confirm}>Start New Training</button>
                </div>
            </div>
        </Modal>
    );
}

export default startPrompt;