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
// import axios from '../../../axios-dev';
// import { convertToInputDateFormat } from '../../../utility';


class Exercise extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
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
            // exercise: this.props.userExercise ? this.props.userExercise.exercise : null,
            inExerciseClear: false,
            showConfirmation: false
        }
    }

    formElementValueChangeHandler = (event) => {
        const element = event.target;
        const name= element.name;
        const value = element.type === "checkbox" ? element.checked : element.value;

        this.setState({[name]: (value)});
    }

    addSetHandler = (event) => {
        
        let set = {
            id: this.state.currentSetId,
            weight: Math.round((this.state.currentWeight * 100) / 100),
            reps: parseInt(this.state.currentReps, 10),
            comment: this.state.currentComment,
            drop: this.state.currentDrop,
            tempo: this.state.currentTempo,
            posNo: this.state.sets.length, // TODO: implement some features or remove, correct if editing currently added enabled.
            time: new Date()//convertToInputDateFormat(new Date())
        }

        let sets = [...this.state.sets];
        sets.push(set);
        this.setState({sets: sets});
        this.clearAddSetSection();

        // axios.post('training/exercise/addset/',{
        //     trainingId: this.props.trainingId, 
        //     exerciseId: this.exerciseId,
        //     set: set
        // })
        //     .then(response => {
        //         console.log('Set posted to DB.', response);
        //         // TODO: assign id to set.
        //     })
        //     .catch(err => console.log('Failed to post set to DB \n', err));
    } 

    clearAddSetSection = () => {
        this.setState({
            //currentWeight: "", // keep last weight as log as the same exercise is in progress.
            currentReps: '', // should I keep reps?
            currentDrop: "",
            currentTempo: "",
            currentComment: ''
        });
    }

    toggleExerciseMenu = () => {
        const inExerciseClear = this.state.inExerciseClear;
        this.setState({inExerciseClear: !inExerciseClear});
    }

    clearExerciseAndSetsHandler = () => {
        this.setState({exercise: null, sets: []});
        this.clearAddSetSection();
        this.toggleExerciseMenu();
    }

    changeExerciseHandler = () => {
        this.setState({exercise: null, inExerciseClear: false, showLookup: true});
    }
    
    toggleExerciseLookupHandler = (ev, exercise) => {
        const showLookup = this.state.showLookup;
        if (exercise) {
            const _exercise = {...exercise};
            _exercise.startTime = new Date();
            _exercise.trainingExerciseId = null;
            this.setState({showLookup: !showLookup, exercise: _exercise});
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
        const exercise = {...this.state.exercise};
        exercise.endTime = new Date();
        const sets = [...this.state.sets];
        this.props.completed(exercise, sets); // pass exercise to parent (Training).
        this.setState({exercise: null, sets: [], showConfirmation: false}); // TODO: is this ok?
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
            exerciseLookup =<ExerciseLookup closed={this.toggleExerciseLookupHandler} />
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

export default Exercise;