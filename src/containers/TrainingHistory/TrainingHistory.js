import React from 'react';
import axios from '../../axios-dev';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './TrainingHistory.module.css';
import Training from '../../components/TrainingHistory/Training/Training';
import Spinner from '../../components/UI/Spinner/Spinner';
import Modal from '../../components/UI/Modal/Modal';
import TrainingMenu from '../../components/TrainingHistory/TrainingMenu/TrainingMenu';
import { PieChart } from 'react-chartkick';
import 'chart.js';

class TrainingHistory extends React.Component {

    state = {
        trainings: [],
        loading: true,
        showTrainingMenu: false,
        currentTrainingId: null,
        currentComment: null,
        showChart: false
    }

    toggleExpandHandler = (ev, id) => {
        const trainings = [...this.state.trainings];
        const idx = trainings.findIndex(x => x.id === id);

        const expanded = trainings[idx].expanded;
        trainings[idx] = {...trainings[idx], expanded: !expanded};
        this.setState({trainings: trainings});

        if (!expanded && trainings[idx].exercisesCnt !== trainings[idx].exercises.length) {
            axios.get(`/training-hist/${id}/exercises/`)
            .then(res => {

                if (res.status === 200) {
                    const trainings = [...this.state.trainings];
                    const idx = trainings.findIndex(x => x.id === id);

                    trainings[idx] = {...trainings[idx], exercises: res.data.data};

                    this.setState({trainings: trainings}); 
                }
            });
        }
    }

    toggleExerciseExpandHandler = (ev, trId, id) => {
        const trainings = [...this.state.trainings];
        const idx = trainings.findIndex(x => x.id === trId);

        const exerciseIdx = trainings[idx].exercises.findIndex(x => x.id === id);

        trainings[idx].exercises = [...trainings[idx].exercises];

        const expanded = trainings[idx].exercises[exerciseIdx].expanded;
        
        trainings[idx].exercises[exerciseIdx] = {...trainings[idx].exercises[exerciseIdx], expanded: !expanded};

        this.setState({trainings: trainings});
    }

    toggleTrainingMenuHandler = (ev, id) => {
        const showTrainingMenu = this.state.showTrainingMenu;
        if (this.state.currentComment !== null || this.state.showChart) {
            this.setState({currentComment: null, showTrainingMenu: !showTrainingMenu, showChart: false});
        }
        else {
            this.setState({showTrainingMenu: !showTrainingMenu, currentTrainingId: (!showTrainingMenu ? id: null), currentComment: null, showChart: false});
        }
    }

    showCommentHandler = () => {
        const comment = (this.state.trainings.find(x => x.id === this.state.currentTrainingId)).comment;
        this.setState({currentComment: comment, showTrainingMenu: false});
    }

    showChartHandler = () => {
        const id = this.state.currentTrainingId;
        console.log(this.state.currentTrainingId)
        const trainings = [...this.state.trainings];
        const idx = trainings.findIndex(x => x.id === id);

        if (trainings[idx].exercisesCnt !== trainings[idx].exercises.length) {
            axios.get(`/training-hist/${id}/exercises/`)
            .then(res => {

                if (res.status === 200) {
                    const trainings = [...this.state.trainings];
                    const idx = trainings.findIndex(x => x.id === id);

                    trainings[idx] = {...trainings[idx], exercises: res.data.data};

                    this.setState({trainings: trainings, showChart: true, showTrainingMenu: false}); 
                }
            });
        }
        else {
            this.setState({showChart: true, showTrainingMenu: false}); 
        }
    }

    deleteTrainingHandler = () => {

        const id = this.state.currentTrainingId;
        this.setState({loading: true});
        axios.delete('/training-hist/'+id)
            .then(res => {
                const deletedId = parseInt(res.data.data, 10);
                const trainings = this.state.trainings.filter(x => x.id !== deletedId);
                this.setState({trainings: trainings, showTrainingMenu: false, loading: false});
            });
    }

    componentDidMount () {
        axios.get('/training-hist')
        .then(res => {
            console.log(res);
            if (res.status === 204) {
                this.setState({loading: false});
            }
            else {
                const trainings = res.data.data.map(x => ({...x, exercises: [], expanded: false}));
                console.log(trainings);
                this.setState({trainings: trainings, loading: false});
            }
        })
        .catch(err => {
            this.setState({loading: false});
        });
    }

    render () {
        let content = <Spinner />
        if (!this.state.loading) { 
            if (this.state.trainings.length === 0) {
                content = <p>There is nothing to display, go and do same trainings.</p>
            }
            else {
                content = this.state.trainings.map(x=> <Training 
                    toggleTrainingMenu={(ev) => this.toggleTrainingMenuHandler(ev, x.id)}
                    expand={(ev) => this.toggleExpandHandler(ev, x.id)} 
                    expandExercise={this.toggleExerciseExpandHandler}
                    key={x.id} 
                    training={x}
                     />);
            }
        }

        let trainingMenu = null;
        if (this.state.showTrainingMenu) {
            trainingMenu = <TrainingMenu 
                showComment={this.showCommentHandler}
                showChart={this.showChartHandler}
                deleteTraining={this.deleteTrainingHandler} />
        }
        else if (this.state.currentComment !== null) {
            trainingMenu = <div>
                {this.state.currentComment}
            </div>
        }
        else if (this.state.showChart) {
            const training = this.state.trainings.find(x => x.id === this.state.currentTrainingId);
            const trainingDuration = Date.parse(training.endTime) - Date.parse(training.startTime);

            let unusedTime = 100;
            const parts = training.exercises.map(x => {
                let duration = Date.parse(x.endTime ? x.endTime : x.startTime) - Date.parse(x.startTime)
                duration = Math.round(((duration/trainingDuration)*100)*100) / 100
                unusedTime -= duration;
                return [x.name, duration];
            });
            parts.push(["Not filled time", Math.round(unusedTime*100)/100]);

            trainingMenu = <PieChart data={parts} />
        }

        return (
            <div className={classes.TrainingHistory}>
                <Modal 
                    show={this.state.showTrainingMenu} 
                    modalClose={this.toggleTrainingMenuHandler}
                    showHeader={true}
                    title="Training Menu" >
                    {trainingMenu}
                </Modal>
                <Modal 
                    show={this.state.currentComment !== null} 
                    modalClose={this.toggleTrainingMenuHandler}
                    showHeader={true}
                    title="Comment" >
                    {trainingMenu}
                </Modal>
                <Modal 
                    width="90"
                    show={this.state.showChart} 
                    modalClose={this.toggleTrainingMenuHandler}
                    showHeader={true}
                    title="Exercises in Training" >
                    {trainingMenu}
                </Modal>
                <h5>Trainings history</h5>
                {content}
            </div>
        );
    }
}

export default withErrorHandler(TrainingHistory, axios);