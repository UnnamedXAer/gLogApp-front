import React from 'react';

import Button from '../../components/UI/Button/Button';
//import Modal from '../../components/UI/Modal/Modal'
// import ExerciseLookup from '../ExerciseLookup/ExerciseLookup';
// import Exercise from '../../components/PlanConfigurator/Exercise/Exercise';
import Training from '../../components/PlanConfigurator/Training/Training';
import RoundButton from '../../components/UI/RoundButton/RoundButton';

import classes from './PlanConfigurator.module.css';

// import {Plan, TrainingTemplate, ExerciseTemplate} from '../../Model/PlanModel/PlanModel';


class PlanConfigurator extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     plan: [], // TODO: draw Schema of plan // not expanded trainings
        //     currentTrainingIndex: null, // expanded training index
        //     // Exercises: [], // array of objects
        //     // addedExercises: [{id: 1, name: "Squat", sets: [12, 12, 10, 10], tempo: "2:2:1"}], // array of objects
        //     newSet: "", // new set input value for currently edited exercise
        //     showLookup: false, // show exercise lookup
        //     currentExerciseId: null, // id of exercise currently edited
        //     highlightedExerciseId: null // id of exercise to blink for 2 sec
        // }
        
// https://stackoverflow.com/questions/40732576/good-approach-to-managing-nested-state-in-react
        /*let state = {
            authors : {
                ...this.state.authors, 
                [ givenId ] : { 
                    ...this.state.authors[ givenId ], 
                    bio : newValue 
                }
            }  
        }*/
        //this.setState(state)

        this.state = {
          /*  plan: new Plan(
                123, 
                'Back priority', 
                [
                    new TrainingTemplate (
                        21242,
                        "Day 1",
                        [
                            new ExerciseTemplate (
                                88884,
                                "Squat",
                                "2:2:1",
                                [12, 12, 12, 12]
                            ),
                            new ExerciseTemplate (
                                788884,
                                "Bench press",
                                "2:2:1",
                                [5, 5, 5, 5]
                            ),
                        ]
                    ), // Training 1
                    new TrainingTemplate (
                        27755,
                        "Day 2",
                        [
                            new ExerciseTemplate (
                                188884,
                                "Deadlift",
                                "2:2:1",
                                [3, 3, 2, 1]
                            ),
                            new ExerciseTemplate (
                                388884,
                                "OHP",
                                "2:2:1",
                                [5, 5, 3, 3]
                            ),
                        ]
                    ), //Training 2
                    new TrainingTemplate (
                        44333,
                        "Day 3",
                        [
                            new ExerciseTemplate (
                                488884,
                                "Bulgarian Squat",
                                "",
                                [10, 10, 10, 10]
                            ),
                            new ExerciseTemplate (
                                2582884,
                                "Biceps Curls",
                                "",
                                [15, 15, 13, 13]
                            ),
                        ]
                    ) // Training 3
                ]
            ),*/
            currentTrainingIndex: null, //  expanded training index in plan array
            newSet: "", // new set input value for currently edited exercise
            currentExerciseIndex: null, // index of edited exercise in current training's exercises array
            highlightedExerciseIndex: null, //exercise to blink for 2 sec
            showLookup: false // show exercise lookup
        }
        this.newSetInputRef = React.createRef();
    }

    toggleExerciseLookupHandler = (ev, exercise) => {
        const showLookup = this.state.showLookup;
        if (exercise) {
            const addedExercises = [...this.state.addedExercises];
            const index = addedExercises.findIndex(x => x.id === exercise.id);
            if (index >= 0) {
                this.setState({
                    showLookup: !showLookup, 
                    currentExerciseId: exercise.id, 
                    highlightedExerciseIndex: index
                });
                window.setTimeout(() => this.setState({highlightedExerciseIndex: null}), 2000); // TODO: mb disable on exercise click??
            }
            else {            
                exercise.sets = [];
                exercise.tempo = "";
                // if(this.state.addedExercises.length % 2 === 0) // tmp
                //     exercise.sets = [12,12,10, 10];
                // else
                //     exercise.sets = [5,5,5,5,5];

                let addedExercises = [...this.state.addedExercises];
                addedExercises.push(exercise);
                this.setState({showLookup: !showLookup, addedExercises: addedExercises, currentExerciseId:exercise.id});
            }
        }
        else {
            this.setState({showLookup: !showLookup});
        }
    }

    trainingClickHandler= (ev, trainingIndex) => {
        this.setState({currentTrainingIndex: trainingIndex});
    }

    toggleEditedExerciseHandler = (ev, exId) => {
        this.setState({currentExerciseId: exId});
    }

    exerciseInputChangeHandler = (ev, exId, setIndex) => {
        let addedExercises = [...this.state.addedExercises];
        // probably i could use: currentExerciseId instead of passing id as param or event keep and modify exercise not id
        let editedExerciseIndex = addedExercises.findIndex(x => x.id === exId);

        let value = ev.target.value;

        switch (ev.target.name) {
            case 'set': {
                value = value.replace(/\D/g, "");
                value = value.substring(0, 2);
                
                addedExercises[editedExerciseIndex].sets[setIndex] = value;
                this.setState({addedExercises: addedExercises});
                break;
            }
            case 'newSet': {
                value = value.replace(/\D/g, "");
                value = value.substring(0, 2);
                
                this.setState({newSet: value});
                break;
            }
            case 'tempo': {
                value = value.replace(/[^\d:]/g, ""); // TODO: // correct to format like 2:2:1 | 3:1:2:1
                addedExercises[editedExerciseIndex].tempo = value;
                this.setState({addedExercises: addedExercises});
                break;
            }
            default:
                break;
        }        
    }

    setInputBlurHandler = (ev, exId, setIndex) => {
        if (ev.target.value === "") {
            let addedExercises = [...this.state.addedExercises];
            let editedExerciseIndex = addedExercises.findIndex(x => x.id === exId);
            addedExercises[editedExerciseIndex].sets.splice(setIndex, 1);
            this.setState({addedExercises: addedExercises});
        }
    }

    addSetHandler = (ev, exId) => {
        const newSet = this.state.newSet;

        if (newSet !== "") {
            let addedExercises = [...this.state.addedExercises];
            let editedExerciseIndex = addedExercises.findIndex(x => x.id === exId);
            addedExercises[editedExerciseIndex].sets.push(newSet);
            this.setState({addedExercises: addedExercises, newSet: ""});
        }
        this.newSetInputRef.current.focus();
    }

    addTrainingHandler = (ev) => {
        let plan = [...this.state.plan];
        // plan.push(
        //     {exercises: []}
        // );
        this.setState({plan: plan});
    }

    render () {
        // let exerciseLookup = null;
        // if (this.state.showLookup) {
        //     exerciseLookup =<ExerciseLookup closed={this.toggleExerciseLookupHandler} />
        // }

        // const currentExerciseId = this.state.currentExerciseId;
        // let addedExercises = this.state.addedExercises.map(x => (
        //     <Exercise 
        //         highlight={x.id === this.state.highlightedExerciseId} 
        //         inEdit={x.id === currentExerciseId}
        //         key={x.id}
        //         exercise={x} 
        //         inputChanged={this.exerciseInputChangeHandler}
        //         newSet={this.state.newSet}
        //         addSet={this.addSetHandler}
        //         inputBlured={this.setInputBlurHandler}
        //         clicked={this.toggleEditedExerciseHandler}
        //         newSetRef={this.newSetInputRef}
        //         // ref={this.newSetInputRef}
        //         />
        // ));

        const plan = this.state.plan.trainings.map((x, i) => (
            <Training 
                key={i}
                training={x}
                clicked={(ev) => this.trainingClickHandler(ev, i)}
            />
        ));

        return (
            <div className={classes.PlanConfigurator}>
                <h4>Configurator</h4>
                    {/* {exerciseLookup} */}
                <div>
                    {/* <div className={classes.SingleTraining}>
                            {addedExercises}
                            <div key={-1}><button onClick={this.toggleExerciseLookupHandler}>Add</button></div>
                    </div> */}

                    {plan}
                    <RoundButton clicked={this.addTrainingHandler} />
                </div>
                <div>
                    <Button btnType="Success">Save</Button>
                    <Button btnType="Danger">Discard</Button>
                </div>
            </div>
        );
    }
}

export default PlanConfigurator;