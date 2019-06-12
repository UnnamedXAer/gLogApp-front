import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import classes from './Training.module.css';
import Exercise from './Exercise/Exercise';
import Aux from '../../hoc/Auxiliary';
import Modal from '../../components/UI/Modal/Modal';
import TrainingSummary from '../../components/Training/TrainingSummary/TrainingSummary';
import StartPrompt from '../../components/Training/StartPrompt/StartPrompt';
// import Spinner from '../../components/UI/Spinner/Spinner';
import Confirm from '../../components/UI/Confirm/Confirm';
import axios from '../../axios-dev';
import { convertToInputDateFormat } from '../../utils/utility';
import Button from '../../components/UI/Button/Button';

class Training extends Component {
    constructor (props) {
        super(props);
        this.state = {
            exerciseToUpdate: null,
            exercises: [],
            startTime: "",
            endTime: "",
            showSummary: false,
            summarySpinner: false,
            summaryMsg: null,
            trainingId: null,
            comment: "",
            showStartPrompt: true,
            startPrompSpinner: true,
            redirect: false,
            showSpinner: true,
            savedTrainings: null,
            confirmEditExerciseId: null
        };
    }

    registerNewTraining () {
        console.log('Try to register new TRAINING.')
        axios.post('/training/', {
            startTime: new Date().toUTCString(),//this.state.startTime,
            startTime2: new Date()
        })
        .then(response => {
            console.log('New TRAINING registered with id: ', response.data.data);
            this.setState({
                trainingId: response.data.data.id, 
                showStartPrompt: false, 
                savedTrainings: null, 
                startTime: convertToInputDateFormat(response.data.data.startTime)
            });
        })
        .catch(err => {
            console.log('Failed to register new TRAINING.', err); // todo add error handler
        });
    }

    completeExerciseHandler = (newExercise, sets) => {
        console.log('Training. exercise completed.', newExercise);
        let exercises = [...this.state.exercises];
        
        const exercise = {
            id: newExercise.id,
            startTime: newExercise.startTime,
            endTime: newExercise.endTime,
            exercise: newExercise.exercise,
            sets: sets
        }
        
        const index = exercises.findIndex(x => x.id === exercise.id);
        if (index === -1) {
            exercises.push(exercise);   //add new
        }
        else {
            exercises[index] = exercise; // update existing
        }
        this.setState({
            exercises: exercises,
            exerciseToUpdate: null
        });
        
        const exercise_put = {
            id: newExercise.id,
            startTime: new Date(newExercise.startTime).toUTCString(),
            endTime: new Date(newExercise.endTime).toUTCString(),
            exerciseId: newExercise.exercise.id,
            trainingId: newExercise.trainingId,
        }

        if (this.state.trainingId) {
            this.updateExercise(exercise_put);
        }
        else {
            this.registerNewTraining(); // not too good without saving this exercise after training is created.
        }
    }

    removeExerciseHandler = (id) => {
        console.log(this.state.exercises);
        let newExercises = this.state.exercises.filter(x => x.id !== id);
        console.log(newExercises);
        this.setState({exercises: newExercises, exerciseToUpdate: null, confirmEditExerciseId: null});
    }

    areSetsSaved (sets) {
        // todo mb some checking here and use in complete exercise handler
    }


    updateExercise (exercise) {
        axios.put('/training/exercise', exercise)
            .then(res => {
                console.log('Exercise updated. ', exercise);
            })
            .catch(err => console.log('Fail to update/complete exercise. \n', err, exercise));
    }

    exercisesListItemClickHandler = (id) => {
        this.setState({confirmEditExerciseId: id});
    }

    setExerciseToEditHandler = (ev) => {
        const exercise = this.state.exercises.find(x => x.exercise.id === this.state.confirmEditExerciseId);
        this.setState({exerciseToUpdate: exercise, confirmEditExerciseId: null});
    }

    rejectExerciseToEditHandler = (ev) => {
        this.setState({confirmEditExerciseId: null})
    }

    formElementOnChangeHandler = (ev) => {
        this.setState({[ev.target.name]: ev.target.value});
    }

    toggleTrainingSummary = () => {
        const showSummary = this.state.showSummary;
        this.setState({
            endTime: convertToInputDateFormat(new Date()), 
            showSummary: !showSummary, 
            summaryMsg: null
        });
    }

    trainingCompletionHandler = () => {

        this.setState({summarySpinner: true});

        let training = {
            id: this.state.trainingId,
            startTime: new Date(this.state.startTime).toUTCString(),
            endTime: new Date(this.state.endTime).toUTCString(),
            comment: this.state.comment
        }
        // todo check if exercises / sets are saved.
        console.log(training);
        axios.put('/training/', training)
            .then(res => {
                if (res.status === 200) {
                    console.log('Training completed successfully. \n', res);
                    this.setState({redirect: true});
                }
                else {
                    this.setState({
                        summarySpinner: false, 
                        summaryMsg: ['Unable to update (complete) training.',<br />,'Please try again.',<br />,<i>'Response status code: '{res.status}</i>]
                    });                    
                    console.log('Unable to update (complete) training.', res);
                }
            })
            .catch(err => {
                this.setState({
                    summarySpinner: false, 
                    summaryMsg: ['Error on training completion.',<br />,'Please try again.',<br />,<i>{err.message}</i>]
                });                    
                console.log('Error on training completion. \n', err);
            });
    }

    savedTrainingsSelectHandler = (ev, id) => {
        
        if (id) {
            const training = this.state.savedTrainings.find(training => training.id === id);
            this.setState({showSpinner: true});
            axios.get('/training/details/id/'+training.id)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.data;
                    const st = (data.startTime ? convertToInputDateFormat(data.startTime) : "");
                    const et =  (data.endTime ? convertToInputDateFormat(data.endTime) : ""); // when undefined/null
                    this.setState({
                        trainingId: data.id,
                        startTime: st,
                        endTime: et, // supposed to be empty string
                        comment: (data.comment ? data.comment : ""),
                        // exercises: data.exercises,
                        showSpinner: false,
                        showStartPrompt: false
                    });
                    
                    axios.get('/training/'+training.id+'/exercises/')
                    .then(res => {
                        if (res.status === 200) {
                            this.setState({
                                exercises: res.data.data
                            });
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
        }
        else {
            this.registerNewTraining();
        }
    }

    getNotCompletedTrainings() {
        axios.get('/training/not-completed')
        .then(res => {
            if (res.status === 200) {
                const savedTrainings = res.data.data;
                this.setState({savedTrainings: savedTrainings, startPrompSpinner: false});
            }
            else {
                console.log('no saved trainings');
                this.setState({startPrompSpinner: false});
            }
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                return this.props.history.push('/login');
            }
            console.log(err);
            this.setState({startPrompSpinner: false});
        })
    }

    closeStartPromptHandler = (ev) => {
        this.props.history.goBack();
    }

    componentDidMount () {
        this.getNotCompletedTrainings();
    }

    render () {

        let editExerciseConfirmation = null; 

        if (this.state.confirmEditExerciseId) {
            const name = this.state.exercises.find(x => x.exercise.id === this.state.confirmEditExerciseId).exercise.name;
            editExerciseConfirmation = <Confirm 
                confirm={this.setExerciseToEditHandler} 
                reject={this.rejectExerciseToEditHandler}
                text={<span>Would You like to edit Your <u>{name}</u> details?</span>} />
        }

        let trainingComplete = null;
        let exercisesList = null;
        if (this.state.exercises.length > 0) {
            trainingComplete = <div className={classes.TrainingComplete}>
                <Button btnType="Success" clicked={this.toggleTrainingSummary}>Complete Training</Button>
            </div>

            console.log(this.state.exercises);
            
            exercisesList = this.state.exercises.map((x, index) => { // TODO: probably should move to new component
                let setsText = null;
                if (x.sets.length > 0) {
                let allWeightNumberEqual = true;
                const sets = x.sets;
                const setsLen = sets.length;
                for (let i = setsLen -1; i >= 0; i--) { 
                    if (sets[i-1] && sets[i].weight !== sets[i-1].weight) {
                        allWeightNumberEqual = false;
                        break;
                    }
                }

                if (allWeightNumberEqual) {
                    setsText = `[${sets[0].weight}kg] `;

                    for (let i = 0; i < setsLen; i++) { 
                        setsText += sets[i].reps
                        if (sets[i+1]) {
                            setsText += ' *';
                        }
                    }
                }
                else {
                    setsText = [];
                    for (let i = 0; i < setsLen; i++) { 
                        setsText.push(<span key={i}><span style={{fontSize: '0.8em'}}>{"("+ sets[i].weight +'kg)*'}</span>{sets[i].reps}</span>);
                        if (sets[i+1]) {
                            setsText.push(' / ');
                        }
                    }
                }
            }

            return <li 
                className={classes.CompletedExercise} 
                onClick={() => this.exercisesListItemClickHandler(x.exercise.id)} 
                key={index}>
                {x.exercise.name + ' > '} {setsText}
            </li>
        });
        }
        else {
            exercisesList = <p className={classes.ExerciseListInfo}>Completed exercises here.</p>
        }
        return (
            <div className={classes.Training}>
                {this.state.redirect ? <Redirect to="/home" /> : null}
                {this.state.showStartPrompt ? <StartPrompt 
                    show={true} 
                    close={this.closeStartPromptHandler}
                    loading={this.state.startPrompSpinner} 
                    trainingSelected={this.savedTrainingsSelectHandler} 
                    trainings={this.state.savedTrainings} /> : null
                }
                <Modal 
                    show={this.state.confirmEditExerciseId} 
                    modalClose={this.rejectExerciseToEditHandler}
                    height="30"
                    >
                    {editExerciseConfirmation}
                </Modal>
                
                <Modal show={this.state.showSummary} modalClose={this.toggleTrainingSummary} width={80}>
                    <TrainingSummary 
                        loading={this.state.summarySpinner}
                        summaryMsg={this.state.summaryMsg}
                        exercises={this.state.exercises} 
                        startTime={this.state.startTime} 
                        endTime={this.state.endTime} 
                        summaryCompleted={this.trainingCompletionHandler}
                        summaryCanceled={this.toggleTrainingSummary}
                        timeOnChange={this.formElementOnChangeHandler}
                        commentChanged={this.formElementOnChangeHandler}
                        />
                </Modal>
                <div className={classes.TrainingInfo}>
                    <div className={classes.TrainingTime}>Start: 
                        <input 
                            name="startTime"
                            type="datetime-local" 
                            value={this.state.startTime} 
                            onChange={this.formElementOnChangeHandler} 
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                            /> 
                    {this.state.endTime ? <Aux> End: 
                        <input 
                            name="endTime"
                            type="datetime-local" 
                            value={this.state.endTime} 
                            onChange={this.formElementOnChangeHandler} 
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                            /> </Aux> : null
                    }
                    </div>
                    {trainingComplete}
                </div>
                <div>
                    <ul>
                        {exercisesList}
                    </ul>
                </div>
                <Exercise
                removeExercise={this.removeExerciseHandler}
                completed={this.completeExerciseHandler} 
                exerciseToUpdate={this.state.exerciseToUpdate}
                trainingId={this.state.trainingId} />
            </div>
        );
    }
}

export default (Training);