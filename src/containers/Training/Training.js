import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import classes from './Training.module.css';
import Exercise from './Exercise/Exercise';
//import { UserExerciseModel } from '../../Model/ExerciseModel/ExerciseModel';
import Aux from '../../hoc/Auxiliary';
import Modal from '../../components/UI/Modal/Modal';
import TrainingSummary from '../../components/Training/TrainingSummary/TrainingSummary';
import StartPrompt from '../../components/Training/StartPrompt/StartPrompt';
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
            trainingId: null,
            comment: "",
            showStartPrompt: false,
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
            this.setState({trainingId: null}); // TODO: remove
        });
    }

    completeExerciseHandler = (newExercise, sets) => {
        console.log('Training. exercise completed.', newExercise);
        let userExercises = [...this.state.exercises]; // TODO: i'm not sure if it do the work correctly. -> it works if just new element is pushed? - no modifications on existing
        const exercise = {
            exercise: newExercise.exercise,
            id: newExercise.id,
            startTime: newExercise.startTime,
            endTime: newExercise.endTime,
            comment: newExercise.comment,
            sets: sets
        }
        userExercises.push(exercise);
        this.setState({
            exercises: userExercises,
            exerciseToUpdate: null
        });

        axios.put('/training/exercise', newExercise)
            .then(res => {
                if (res.status === 200) {
                    console.log('Exercise put to DB. \n', res)
                    let exercises = [...this.state.exercises];
                    const exerciseIdx = exercises.findIndex(exercise => exercise.startTime === newExercise.startTime); // todo use different property
                    exercises[exerciseIdx] = {...exercises[exerciseIdx], id: res.data.data};

                    console.log('exercises', exercises);
                    console.log('state.exercises', this.state.exercises);
                    this.setState({exercises});
                }
                else {
                    console.log('Unable to update (complete) exercise.', res);
                }
            })
            .catch(err => console.log('Fail to complete exercise. \n', err, newExercise));
    }

    exercisesListItemClickHandler = (id) => {
        const exercise = {...this.state.exercises.find(x => x.id === id)};
        console.log('completed exercise clicked. ', exercise);
        const ans = window.confirm('Would You like to edit Your '+ exercise.exercise.name + ' details?');
        console.log(ans);
        if (ans) {
            this.setState({exerciseToUpdate: exercise});
        }
        // TODO: ADD confirm component
    }

    timeOnChangeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    toggleTrainingSummary = () => {
        const showSummary = this.state.showSummary;
        this.setState({endTime: convertToInputDateFormat(new Date()), showSummary: !showSummary});
    }

    trainingCompletionHandler = () => {
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
                if (res.status === 200) {
                    console.log('Training completed successfully. \n', res);
                    this.setState({redirect: true});
                }
                else {
                    console.log('Unable to complete training.', res)
                }
            })
            .catch(err => console.log('Error on training completion. \n', err));

        // this.setState({
        //     exercises: [],
        //     exercise: null,
        //     startTime: "",
        //     endTime: "",
        //     showSummary: false,
        //     trainingId: null,
        //     comment: ""
        // });
        // this.props.history.push('/home');
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
                this.setState({savedTrainings: savedTrainings, showStartPrompt: true});
            }
            else {
                console.log('no saved trainings');
                this.setState({showStartPrompt: true});
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
            
            exercisesList = this.state.exercises.map(x => { // TODO: probably should move to new component
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

            return <li onClick={() => this.exercisesListItemClickHandler(x.exercise.id)} key={x.exercise.id}>{x.exercise.name + ' > '} {setsText}</li>
        });
        }
        else {
            exercisesList = <p className={classes.ExerciseListInfo}>Completed exercises here.</p>
        }
        return (
            <div className={classes.Training}>
                {this.state.redirect ? <Redirect to="/home" /> : null}
                {this.state.showStartPrompt ? <StartPrompt show={true} trainingSelected={this.savedTrainingsSelectHandler} trainings={this.state.savedTrainings} /> : null}
                <Modal show={this.state.showSummary} modalClosed={this.toggleTrainingSummary}>
                    <TrainingSummary 
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