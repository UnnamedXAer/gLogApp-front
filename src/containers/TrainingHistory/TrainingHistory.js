import React from 'react';
import axios from '../../axios-dev';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import classes from './TrainingHistory.module.css';
import Training from '../../components/TrainingHistory/Training/Training';
import Spinner from '../../components/UI/Spinner/Spinner';

class TrainingHistory extends React.Component {

    state = {
        trainings: null,
        loading: true
    }

    toggleExpandHandler = (ev, id) => {
        const trainings = [...this.state.trainings];
        const idx = trainings.findIndex(x => x.id === id);

        const expanded = trainings[idx].expanded;
        trainings[idx] = {...trainings[idx], expanded: !expanded};
        this.setState({trainings: trainings});

        axios.get(`/training-hist/exercises/${id}`)
        .then(res => {

            if (res.status === 200) {
                const trainings = [...this.state.trainings];
                const idx = trainings.findIndex(x => x.id === id);

                trainings[idx] = {...trainings[idx], exercises: res.data.data};

                this.setState({trainings: trainings}); 
            }
        });
    }

    toggleExerciseExpandHandler = (ev, trId, id) => {
        const trainings = [...this.state.trainings];
        const idx = trainings.findIndex(x => x.id === trId);

        const exerciseIdx = trainings[idx].exercises.findIndex(x => x.id === id);

        trainings[idx].exercises = [...trainings[idx].exercises];

        const expanded = trainings[idx].exercises[exerciseIdx].expanded;
        
        trainings[idx].exercises[exerciseIdx] = {...trainings[idx].exercises[exerciseIdx], expanded: !expanded}

        this.setState({trainings: trainings});
    }

    componentDidMount () {
        axios.get('/training-hist')
        .then(res => {
            if (res.status === 200) {
                const trainings = res.data.data.map(x => ({...x, exercises: [], expanded: false}));
                console.log(trainings);
                this.setState({trainings: trainings, loading: false});
            }
        });
    }


    render () {
        let content = <Spinner />
        if (!this.state.loading) { 
            content = this.state.trainings.map(x=> <Training 
                    expand={(ev) => this.toggleExpandHandler(ev, x.id)} 
                    expandExercise={this.toggleExerciseExpandHandler}
                    key={x.id} 
                    training={x}
                     />);
        }

        return (
            <div className={classes.TrainingHistory}>
                <h5>Trainings history</h5>
                {content}
            </div>
        );
    }
}

export default withErrorHandler(TrainingHistory, axios);