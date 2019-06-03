import React from 'react';
import classes from './Exercise.module.css';
import Aux from '../../../hoc/Auxiliary';
import ExerciseSets from '../../../components/Training/ExerciseSets/ExerciseSets';
import AddSet from '../../../components/Training/AddSet/AddSet';
import Modal from '../../../components/UI/Modal/Modal';
import ExerciseMenu from '../../../components/Training/ExerciseMenu/ExerciseMenu';
import ExerciseLookup from '../../ExerciseLookup/ExerciseLookup';
import RoundButton from '../../../components/UI/RoundButton/RoundButton';
import Confirm from '../../../components/UI/Confirm/Confirm';
import axios from '../../../axios-dev';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
// import { convertToInputDateFormat } from '../../../utils/utility';


class Exercise extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            id: null,
            readOnly: true,
            showLookup: false,
            currentWeight: '',
            currentReps: '',
            currentDrop: "",
            currentTempo: "",
            currentComment: "",
            currentSetId: null,
            sets: this.props.userExercise? this.props.userExercise.sets : [],
            exercise: null,//{id:101, name: 'Landmire Press'},
            startTime: null,
            endTime: null,
            inExerciseClear: false,
            showConfirmation: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        console.log('derived')
        // const isPropExercise = (props.exerciseToUpdate !== null);
        const exerciseToUpdate = props.exerciseToUpdate;
        if ((exerciseToUpdate !== null) && exerciseToUpdate.id !== state.id) {
            console.log('updated state with props.')
            return {
                id: exerciseToUpdate.id,
                readOnly: true,
                showLookup: false,
                currentWeight: '',
                currentReps: '',
                currentDrop: "",
                currentTempo: "",
                currentComment: "",
                currentSetId: null,
                sets: exerciseToUpdate.sets,
                exercise: exerciseToUpdate.exercise,//{id:101, name: 'Landmire Press'},
                startTime: exerciseToUpdate.startTime,
                endTime: exerciseToUpdate.endTime,
                // inExerciseClear: false,
                // showConfirmation: false
            };
        }
        return null;
    }

    formElementValueChangeHandler = (event) => {
        const element = event.target;
        const name= element.name;
        const value = element.type === "checkbox" ? element.checked : element.value;

        this.setState({[name]: (value)});
    }

    addSetHandler = (event) => {
        
        if(!this.state.currentWeight || !this.state.currentReps) {
            return window.alert('Weight and reps are required. If you fe. do not remember the value use -1.');
        }

        // todo: if edited find from this.sets.

        let set = {
            trainingId: this.props.trainingId,
            exerciseId: this.state.id,
            id: this.state.currentSetId,
            weight: Math.round((this.state.currentWeight * 100) / 100),
            reps: parseInt(this.state.currentReps, 10),
            comment: this.state.currentComment,
            drop: this.state.currentDrop,
            tempo: this.state.currentTempo,
            time: new Date()//convertToInputDateFormat(new Date())
        }

        let sets = [...this.state.sets];

        console.log('_set', { 
            id: set.id, 
            weight: set.weight, 
            reps: set.reps, 
            comment: set.comment, 
            drop: set.drop, 
            tempo: set.tempo, 
            time: set.time
        });
        sets.push({ 
            id: set.id, 
            weight: set.weight, 
            reps: set.reps, 
            comment: set.comment, 
            drop: set.drop, 
            tempo: set.tempo, 
            time: set.time
        });
        this.setState({sets: sets});
        this.clearAddSetSection();

        if (this.currentSetId) {
            this.putSet(set);
        }
        else {
            this.postSet(set); 
        }
    } 

    postSet(set) {
        axios.post('/training/set', set)
            .then(res => {
                console.log(res)
                // update set
            })
            .catch(err => {
                console.log(err);
            });
    }

    putSet(set) {
        axios.put('/training/set', set)
            .then(res => {
                console.log(res)
                // update set
            })
            .catch(err => {
                console.log(err);
            });
    }

    deleteSet(id) {
        axios.delete('/training/set/'+id)
            .then(res => {
                // update set
                console.log(res)
            })
            .catch(err => {
                console.log(err);
            });
    }

    clearAddSetSection = () => {
        this.setState({
            //currentWeight: "", // keep last weight as log as the same exercise is in progress.
            // currentReps: '', // should I keep reps?
            // currentDrop: "",
            // currentTempo: "",
            // currentComment: '',
            currentSetId: null
        });
    }

    toggleExerciseMenu = () => {
        const inExerciseClear = this.state.inExerciseClear;
        this.setState({inExerciseClear: !inExerciseClear});
    }

    clearExerciseAndSetsHandler = () => {
        const id = this.state.id;
        axios.delete('/training/exercise/'+id)
            .then(res => {
                this.clearAddSetSection();
                this.toggleExerciseMenu();
                this.props.removeExercise(id);
                this.setState({exercise: null, sets: [], id: null, startTime: null, endTime: null});
            })
            .catch(err => {
                console.log(err);
            });
    }

    changeExerciseHandler = () => {
        this.toggleExerciseMenu();
        this.toggleExerciseLookupHandler(null, null);
    }
    
    toggleExerciseLookupHandler = (ev, exercise) => {
        const showLookup = this.state.showLookup;
        if (exercise) {
            if ( this.state.id) {
                // replace current exercise
                axios.put('training/exercise', { 
                    trainingId: this.props.trainingId,
                    exerciseId: exercise.id
                })
                .then(res => {
                    this.setState({showLookup: !showLookup, id: res.data.data, exercise: exercise});
                })
                .catch (err => {
                    console.log(err)
                    this.setState({showLookup: !showLookup});
                });
            }
            else {
                // create new training exercise
                const startTime = new Date();
                axios.post('training/exercise', { 
                    trainingId: this.props.trainingId,
                    exerciseId: exercise.id,
                    startTime: startTime
                })
                .then(res => {
                    this.setState({showLookup: !showLookup, startTime: startTime, endTime: null, id: res.data.data, exercise: exercise});
                })
                .catch (err => {
                    console.log(err)
                    this.setState({showLookup: !showLookup, startTime: startTime, endTime: null, id: null, exercise: exercise});
                });
            }
        }
        else {
            this.setState({showLookup: !showLookup});
        }
    }

    completeExerciseHandler = () => {
        if (this.state.sets.length < 1) {
            this.toggleExerciseConfirmation();
        }
        else {
            this.completeExercise();
        }
    }

    completeExercise = () => {
        console.log(this.state);
        const exercise = {
            id: this.state.id,
            trainingId: this.props.trainingId,
            startTime: this.state.startTime,
            endTime: (this.state.endTime ? this.state.endTime : new Date()), // todo allow editing start / end time
            exercise: this.state.exercise
        };
        const sets = [...this.state.sets];
        this.props.completed(exercise, sets); // pass exercise to parent (Training).
        this.setState({exercise: null, id: null,startTime: null, endTime: null, currentSetId: null, sets: [], showConfirmation: false}); // TODO: is this ok?
    }

    toggleExerciseConfirmation = () => {
        const showConfirmation = this.state.showConfirmation;
        this.setState({showConfirmation: !showConfirmation});
    }



/* lifeCycle methods */

    componentDidMount () {
        if (this.props.exerciseToUpdate) {
            console.log('Exercise.componentDidMount: Exercise update not implemented yet :(');
        }
    }

    render () {
        let exerciseLookup = null;

        let exerciseHeader = <RoundButton size="40" float="right" sign="tick" clicked={this.completeExerciseHandler} />

        let exerciseTitle = null;
        if (this.state.showLookup) {
            exerciseLookup = <ExerciseLookup closed={this.toggleExerciseLookupHandler} />
        }
        else if (!this.state.exercise) {
            exerciseHeader = <RoundButton 
                size="35"
                float="right"
                clicked={this.toggleExerciseLookupHandler} />
        }
        else {
            exerciseTitle = <Aux>
                    <h3 style={{display: "inline"}}>{this.state.exercise.name}</h3>
                    <RoundButton size="25" sign="menuV" bgColor="white" float="unset" clicked={this.toggleExerciseMenu} />
                </Aux>;
        }

        return (
            <div className={classes.Exercise}>
                {exerciseLookup}
                <Modal show={this.state.showConfirmation} modalClose={this.toggleExerciseConfirmation}>
                    <Confirm 
                        text={"There is no sets, is that Ok?"} 
                        confirm={this.completeExercise} 
                        reject={this.toggleExerciseConfirmation} />
                </Modal>
                <Modal show={this.state.inExerciseClear} modalClose={this.toggleExerciseMenu} >
                    <ExerciseMenu 
                        clearExercise={this.clearExerciseHandler} 
                        clearExerciseAndSets={this.clearExerciseAndSetsHandler} 
                        doNothing={this.toggleExerciseMenu} 
                    />
                </Modal>
                <div>
                    {exerciseTitle}
                    {exerciseHeader}
                </div>
                    {this.state.exercise ?
                        <Aux>
                            <ExerciseSets sets={this.state.sets} />
                            <AddSet 
                                inReadOnly={this.state.readOnly}
                                weightVal={this.state.currentWeight}
                                repsVal={this.state.currentReps}
                                dropVal={this.state.currentDrop}
                                commentVal={this.state.currentComment}
                                tempoVal={this.state.currentTempo}
                                elementValueChanged={this.formElementValueChangeHandler}
                                addSet={this.addSetHandler}
                                /> 
                        </Aux>
                        : <p className={classes.ExerciseInfo}>Tap on ( + ) to add exercise.</p>
                    }
            </div>
        );
    }
}

export default withErrorHandler(Exercise, axios);