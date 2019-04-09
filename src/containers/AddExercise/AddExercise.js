import React from 'react';
import classes from './AddExercise.module.css';
import axios from '../../axios-dev';
import Multiselect from '../Multiselect/Multiselect';

class AddExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            file: null,
            setUnit: 1,
            engagedParties: [], // {id, name} of body parts
            engagedPartiesOptions: [],
            accessory4Exercise: [], // {id, name} of exercises
            accessory4ExerciseOptions: [],
            exerciseIsAccessoryForExercises: [],
            exerciseIsAccessoryForExercisesOptions: [],
            ytUrl: '',
            showYTFrame: false,
            multipleSelect_inputVal: '',
            nameError: false
        }

        this.multipleSelectInputChanged_timeout = null;
    }

    formElementChangeHandler = (event) => {

        switch (event.target.type) {
            case 'file':
                this.setState({[event.target.name]: event.target.files[0]});
                break;        
            default:
                if (event.target.name === 'ytUrl') {
                    let url = event.target.value;
                    if ((url.indexOf('https://www.youtube.com/') === 0 || url.indexOf('https://youtu.be/') === 0) 
                        && (url.length > ('https://youtu.be/').length ||url.length > ('https://www.youtube.com/').length)) {
                        const listIndex = url.indexOf('list=');
                        if (listIndex !== -1) {
                            url = url.substring(0, listIndex-1);
                        }
                        url = url.replace("watch?v=", "embed/");
                        // eslint-disable-next-line
                        url = url.replace('https\:\/\/youtu.be\/', 'https\:\/\/www.youtube.com\/embed\/');
                        this.setState({[event.target.name]: url, showYTFrame: true});
                    }
                    else {
                        this.setState({[event.target.name]: url, showYTFrame: false});
                    }
                }
                else 
                    this.setState({[event.target.name]: event.target.value});
                break;
        }
    }

    submitFormHandler = (event) => {
        event.preventDefault();

        const _state = this.state;
        const formdata = new FormData();
        formdata.append('name', _state.name);
        formdata.append('description', _state.description);
        formdata.append('ytUrl', _state.ytUrl);
        formdata.append('setUnit', _state.setUnit);
        formdata.append('engagedParties', JSON.stringify(_state.engagedParties));
        formdata.append('accessory4Exercise', JSON.stringify(_state.accessory4Exercise));
        formdata.append('exerciseIsAccessoryForExercises', JSON.stringify(_state.exerciseIsAccessoryForExercises));
        formdata.append('userId', 10); // TODO use real user!
        formdata.append('file', _state.file, _state.name+Date.now()+'.jpg');

        // for (var key of formdata.entries()) {
		// 	console.log(key[0] + ', ' + key[1]);
		// }

        axios.post('/exercise/new', formdata, {
                onUploadProgress: ProgressEvent => {
                    console.log('Uploaded: '+Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)+'%.');
                }
            })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err);
            });
    }

    checkNameBlurHandler = (ev) => {
        if (ev.target.value !== ''){
            axios.get('/exercise/name/'+ev.target.value)
            .then(res => {
                if (res.data === "") {
                    this.setState({nameError: true});
                }
                else {
                    this.setState({nameError: false});
                }
            })
            .catch(err => console.log('checkNameBlurHandler\n', err));
        }
        else {
            this.setState({nameError: false});
        }
    }

    getSelectedOptionsSelectHandler = (options, dataName) => {
        this.setState({[dataName]: options});
    }

    componentDidMount () {
        axios.get('/exercise/all/')
            .then(res => {
                this.setState({accessory4ExerciseOptions: res.data, exerciseIsAccessoryForExercisesOptions: res.data});
            })
            .catch(err => {
                console.log(err);
            });

        axios.get('/body-part/all/')
            .then(res => {
                this.setState({engagedPartiesOptions: res.data});
            })
            .catch(err => {
                console.log(err);
            });
    }

    render () {
        return (
            <div className={classes.AddExercise}>
                <h3>New Exercise:</h3>
                <div className={classes.AddExerciseFormContainer}>
                    <form onSubmit={this.submitFormHandler} className={classes.Form}>
                        <label className={classes.FormElement}>Name:
                            <input className={[classes.Name, (this.state.nameError === true ? classes.FormElementError : "")].join(' ')} 
                                type="text" 
                                name="name" 
                                value={this.state.name} 
                                onChange={this.formElementChangeHandler} 
                                onBlur={this.checkNameBlurHandler}/>
                        </label><br />
                        <label className={classes.FormElement}>Description:
                            <textarea className={classes.Description} 
                                type="text" 
                                name="description" 
                                cols="40" 
                                rows="4" 
                                value={this.state.description} 
                                onChange={this.formElementChangeHandler} />
                        </label><br />
                        <label className={classes.FormElement}>Sets Unit:
                            <select className={classes.setUnit}
                                name="setUnit" 
                                value={this.state.setUnit} 
                                onChange={this.formElementChangeHandler}>
                                <option value="1">Repetitions</option>
                                <option value="2">Time</option>
                            </select>
                        </label><br />
                        <div className={[classes.Multiselect, classes.FormElement].join(' ')}>
                            <Multiselect 
                                title="Engaged parties by this exercise:" 
                                options={this.state.engagedPartiesOptions}
                                dataName="engagedParties"
                                sendSelectedOnSelect={this.getSelectedOptionsSelectHandler}
                                />

                        </div>
                        <div className={[classes.Multiselect, classes.FormElement].join(' ')}>
                            <Multiselect 
                                title="This exercise is accessory for:" 
                                options={this.state.exerciseIsAccessoryForExercisesOptions}
                                dataName="exerciseIsAccessoryForExercises"
                                sendSelectedOnSelect={this.getSelectedOptionsSelectHandler}
                                />
                        </div>
                        <div className={[classes.Multiselect, classes.FormElement].join(' ')}>
                            <Multiselect 
                                title="Accessories for this exercise:" 
                                options={this.state.accessory4ExerciseOptions}
                                dataName="accessory4Exercise"
                                sendSelectedOnSelect={this.getSelectedOptionsSelectHandler}
                                />
                        </div>
                        <label className={classes.FormElement}>Photo:
                            <input className={classes.Photo} type="file" name="file" onChange={this.formElementChangeHandler} />
                        </label><br />
                        <label className={classes.FormElement}>Link to YT:
                            <input className={classes.linkYT} 
                                type="text" 
                                name="ytUrl" 
                                onChange={this.formElementChangeHandler} 
                                value={this.state.ytUrl} />
                            {this.state.showYTFrame ? <div className={classes.YTContainer}>
                            <iframe width="100%"  title="Exercise YT Video"
                                src={this.state.ytUrl} 
                                frameBorder="0" 
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                ></iframe>
                                </div>: null}
                        </label><br />
                        <label className={classes.FormElement}>
                            <input className={classes.Submit} type="submit" name="submit" value="Go" />
                        </label><br />
                    </form>
                </div>
                <hr />
            </div>
        );
    }
}

export default AddExercise;