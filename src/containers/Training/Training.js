import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import classes from './Training.module.css';
import Exercise from './Exercise/Exercise';
//import { UserExerciseModel } from '../../Model/ExerciseModel/ExerciseModel';
import Aux from '../../hoc/Auxiliary';
import Modal from '../../components/UI/Modal/Modal';
import TrainingSummary from '../../components/Training/TrainingSummary/TrainingSummary';
import StartPrompt from '../../components/Training/StartPrompt/StartPrompt';
import Spinner from '../../components/UI/Spinner/Spinner';
import axios from '../../axios-dev';
import { convertToInputDateFormat } from '../../utils/utility';

class Training extends Component {
    constructor (props) {
        super(props);
        this.state = {
            exerciseToUpdate: null,
            exercises: [],
            startTime: convertToInputDateFormat(new Date()),
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
            savedTrainings: null
        };
    }

    registerNewTraining () {
        console.log('Try to register new TRAINING.')
        axios.post('/training/', {
            startTime: this.state.startTime
        })
        .then(response => {
            console.log('New TRAINING registered with id: ', response.data.data);
            this.setState({trainingId: response.data.data, showStartPrompt: false, savedTrainings: null});
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
        
        const index = exercises.findIndex(x => x.id === newExercise.id);
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
            startTime: newExercise.startTime,
            endTime: newExercise.endTime,
            exerciseId: newExercise.exercise.id,
            trainingId: newExercise.trainingId,
        }
        axios.put('/training/exercise', exercise_put)
            .then(res => {
                if (res.status === 201) {
                    //todo toaster
                }
                else {
                    console.log('Unable to update (complete) exercise.', res);
                }
            })
            .catch(err => console.log('Fail to complete exercise. \n', err, newExercise));
    }

    exercisesListItemClickHandler = (id) => {
        const exercise = {...this.state.exercises.find(x => x.exercise.id === id)};

        console.log('completed exercise clicked. ', exercise);
        // TODO: ADD confirm component
        const ans = window.confirm('Would You like to edit Your '+ exercise.exercise.name + ' details?');
        console.log(ans);
        if (ans) {
            this.setState({exerciseToUpdate: exercise});
        }
    }

    timeOnChangeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    toggleTrainingSummary = () => {
        const showSummary = this.state.showSummary;
        this.setState({endTime: convertToInputDateFormat(new Date()), showSummary: !showSummary, summaryMsg: null});
    }

    trainingCompletionHandler = () => {

        this.setState({summarySpinner: true});

        let training = {
            id: this.state.trainingId,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            comment: this.state.comment
        }
        // todo check if exercises / sets are saved.
        console.log(training);
        axios.put('/training/', training)
            .then(res => {
                if (res.status === 201) {
                    console.log('Training completed successfully. \n', res);
                    this.setState({redirect: true});
                }
                else {
                    this.setState({
                        summarySpinner: false, 
                        summaryMsg: ['Unable to update (complete) training.',<br />,'Please try again.']
                    });                    
                    console.log('Unable to update (complete) training.', res);
                }
            })
            .catch(err => {
                this.setState({
                    summarySpinner: false, 
                    summaryMsg: ['Error on training completion.',<br />,'Please try again.',<br />,err.message]
                });                    
                console.log('Error on training completion. \n', err);
            });
    }

    savedTrainingsSelectHandler = (ev, id) => {
        
        if (id) {
            const training = this.state.savedTrainings.find(training => training.id === id); // TODO will not work for not saved trainings
            this.setState({showSpinner: true});
            axios.get('/training/details/id/'+training.id)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data.data;
                    const st = (data.startTime ? convertToInputDateFormat(data.startTime) : "");
                    const et =  (data.endTime ? convertToInputDateFormat(data.endTime) : "");
                    this.setState({
                        trainingId: data.id,
                        startTime: st,
                        endTime: et, // supposed to be empty string
                        comment: (data.comment ? data.comment : ""),
                        // exercises: data.exercises,
                        showSpinner: false,
                        showStartPrompt: false
                    });
                }
            })
            .catch(err => {
                console.log(err)
                // this.setState()
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
            console.log(err);
        })
    }

    componentDidMount () {
        this.getNotCompletedTrainings();
        // const savedTrainings = localStorage.getItem('trainings');
        // if (savedTrainings) {
        //     let ids = null;
        //     try {
        //         ids = JSON.parse(savedTrainings);
        //         if (ids && ids.length > 0) {
        //             axios.get('/training/ids', {
        //                 params: ids
        //             })
        //             .then(res => {
        //                 this.setState({showStartPrompt: true, savedTrainings: res.data.ids});
        //             })
        //             .catch(err => {
        //                 this.setState({showStartPrompt: true});
        //             })
        //         }
        //     }
        //     catch (err) {
        //         console.log(err);
        //         this.setState({showStartPrompt: true});
        //     }
        // }
        // else {
        //     this.setState({showStartPrompt: true});
        //     // this.registerNewTraining();
        // }
    }

    render () {
        let trainingComplete = null;
        let exercisesList = null;
        if (this.state.exercises.length > 0) {
            trainingComplete = <div className={classes.TrainingComplete}>
                <button onClick={this.toggleTrainingSummary}>Complete Training</button>
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

            return <li onClick={() => this.exercisesListItemClickHandler(x.exercise.id)} key={index}>{x.exercise.name + ' > '} {setsText}</li>
        });
        }
        else {
            exercisesList = <p className={classes.ExerciseListInfo}>Completed exercises here.</p>
        }
        return (
            <div className={classes.Training}>
                {this.state.redirect ? <Redirect to="/home" /> : null}
                {this.state.showStartPrompt ? <StartPrompt show={true} loading={this.state.startPrompSpinner} trainingSelected={this.savedTrainingsSelectHandler} trainings={this.state.savedTrainings} /> : null}
                <Modal show={this.state.showSummary} modalClosed={this.toggleTrainingSummary}>
                    <TrainingSummary 
                        loading={this.state.summarySpinner}
                        summaryMsg={this.state.summaryMsg}
                        exercises={this.state.exercises} 
                        startTime={this.state.startTime} 
                        endTime={this.state.endTime} 
                        summaryCompleted={this.trainingCompletionHandler}
                        summaryCanceled={this.toggleTrainingSummary}
                        timeOnChange={this.timeOnChangeHandler}
                        />
                </Modal>
                <div className={classes.TrainingInfo}>
                    <div className={classes.TrainingTime}>Start: 
                        <input 
                            name="startTime"
                            type="datetime-local" 
                            value={this.state.startTime} 
                            onChange={this.timeOnChangeHandler} 
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
                            /> 
                    {this.state.endTime ? <Aux> End: 
                        <input 
                            name="endTime"
                            type="datetime-local" 
                            value={this.state.endTime} 
                            onChange={this.timeOnChangeHandler} 
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
                completed={this.completeExerciseHandler} 
                exerciseToUpdate={this.state.exerciseToUpdate}
                trainingId={this.state.trainingId} />
            </div>
        );
    }
}

export default Training;