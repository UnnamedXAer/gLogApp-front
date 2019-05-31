import React from 'react';
import { Link } from 'react-router-dom';
import classes from './StartPrompt.module.css';
import Modal from '../../UI/Modal/Modal';
import Spinner from '../../UI/Spinner/Spinner';
import Aux from '../../../hoc/Auxiliary';
import Button from '../../UI/Button/Button';

const startPrompt = props => {

    let trainings = null; 
    if (props.trainings) {
        trainings = <ol>
                {props.trainings.map((training,index) => <li className={classes.ListItem} key={index} onClick={(ev) => props.trainingSelected(ev, training.id)}>{training.startTime}</li>)}
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
                {props.loading ? <Spinner /> :
                    <Aux>
                        <div className={classes.SavedTrainings}>
                            {trainings? 
                                <Aux>
                                    <h4>The following trainings are not completed select one of them or start new.</h4> 
                                    {trainings.length > 1 ? <p>You should go to <Link to="/training-history">Training History</Link> and fix uncompleted trainings.</p> : null}
                                    {trainings}
                                </Aux> 
                                : <h4>Press the button to start training.</h4> 
                            }
                            </div>
                        <div className={classes.Buttons}>
                            <Button btnType="Success" clicked={props.trainingSelected}>Start New Training</Button>
                        </div>
                    </Aux>
                }
            </div>
        </Modal>
    );
}

export default startPrompt;