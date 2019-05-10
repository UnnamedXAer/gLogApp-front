import React from 'react';
import axios from '../../axios-dev';

import ExerciseDetails from '../../components/ExerciseDetails/ExerciseDetails';
import Aux from '../../hoc/Auxiliary';
import CloseArrow from '../../components/UI/CloseArrow/CloseArrow';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import Modal from "../../components/UI/Modal/Modal";
import classes from './ExerciseLookup.module.css';

class ExerciseLookup extends React.Component {

    state = {
        exercises: [],
        searchField: "",
        showDetails: false,
        detailedExercise: null
    }

    inputRef = React.createRef();

    inputChangeHandler = (ev) => {
        const currentValue = ev.target.value;
        this.setState({searchField: currentValue});
        if (currentValue !== "") {
            axios.get('/exercise/name/'+currentValue)
                .then(res => {
                    this.setState({exercises: res.data.data});
                })
                .catch(err => {
                    console.log('ExerciseLookup ',err);
                });
        }
        else {
            this.setState({exercises: []});
        }
    }

    componentDidMount () {
        this.inputRef.current.focus();
    }

    exerciseSelectHandler = (ev, id) => {
        const exercise = this.state.exercises.find(x => x.id === id);
        // return exercise to parent.
        this.props.closed(null, exercise);
    }

    showDetailsHandler = (ev, id) => {
        if (!this.state.detailedExercise || id !== this.state.detailedExercise.id) {

        axios.get('exercise/details/id/'+id)
            .then(res => {
                this.setState({detailedExercise: res.data, showDetails: true});
                console.log(res.data);
            })
            .catch(err => {
                console.log('showExerciseDetail ', err);
            });
        }
        else {
            this.setState({showDetails: true});
        }
    }

    closeDetailHandler = (ev) => {
        this.setState({showDetails: false});
    }

    render () {
        let results = <div key={-1}>{this.state.searchField !== "" ? "No results" : "Type to search..."}</div>
        if (this.state.exercises.length > 0) {
            results = this.state.exercises.map(x => (
                    <div className={classes.Exercise} key={x.id} >
                        <div className={classes.ExerciseName} onClick={(ev) => this.exerciseSelectHandler(ev, x.id)}>{x.name}</div>
                        <div className={classes.ExerciseInfoBtn} onClick={(ev) => this.showDetailsHandler(ev, x.id)}><span>i</span></div>
                    </div>
            ));
        }
        let exerciseDetails = null;
        if (this.state.showDetails) {
            exerciseDetails = <ExerciseDetails exercise={this.state.detailedExercise}/>
        }

        return ( // TODO: rows overlapped by not visible elements on wider screens.
            <Aux>
                <Backdrop show={true} clicked={this.props.closed} />
                <div className={classes.ExerciseLookup}>
                        <div className={classes.SearchSection}>
                            {<div><CloseArrow closePanel={this.props.closed}/><div className={classes.H4}>Select an exercise</div></div>}
                            <Modal 
                                height="90" 
                                width="90" 
                                show={this.state.showDetails} 
                                showHeader={true}
                                title="Exercise details"
                                modalClose={this.closeDetailHandler}>
                                {exerciseDetails}
                            </Modal>
                            
                            <div >
                                <div>
                                    <input className={classes.SearchField}
                                        autoComplete="off"
                                        name="searchField"
                                        type="text" 
                                        placeholder="Type to search..."
                                        value={this.state.searchField} 
                                        onChange={this.inputChangeHandler}
                                        ref={this.inputRef} />
                                </div>
                                <div>
                                    {/* maybe later some checkboxes */}
                                </div>
                            </div>
                        </div>
                        <div className={classes.Results}>
                            {results}
                        </div>
                </div>
            </Aux>
        );
    }
}

export default ExerciseLookup;