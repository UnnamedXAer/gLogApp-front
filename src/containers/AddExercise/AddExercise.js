import React from 'react';
import SimpleReactValidator from 'simple-react-validator';
import classes from './AddExercise.module.css';
import axios from '../../axios-dev';
import Multiselect from '../Multiselect/Multiselect';
import FormField from '../../components/UI/FormField/FormField';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class AddExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            file: "",
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

            redirect: false,
            validationErrors: [],
            displayErrors4fields: []
        }
        this.validator = new SimpleReactValidator();
        this.multipleSelectInputChanged_timeout = null;
    }

    formElementChangeHandler = (ev) => {

        const name = ev.target.name;
        const errorFields = [...this.state.displayErrors4fields];

        if (ev.target.value !== "" && errorFields.indexOf(name) === -1) {
            errorFields.push(name);
        }

        switch (ev.target.type) {
            case 'file':
                this.setState({[name]: ev.target.files[0], formValid: this.validator.allValid(), displayErrors4fields: errorFields});
                break;        
            default:
                if (name === 'ytUrl') {
                    let url = ev.target.value;
                    if ((url.indexOf('https://www.youtube.com/') === 0 || url.indexOf('https://youtu.be/') === 0) 
                        && (url.length > ('https://youtu.be/').length || url.length > ('https://www.youtube.com/').length)) {
                        const listIndex = url.indexOf('list=');
                        if (listIndex !== -1) {
                            url = url.substring(0, listIndex-1);
                        }
                        url = url.replace("watch?v=", "embed/");
                        // eslint-disable-next-line
                        url = url.replace('https\:\/\/youtu.be\/', 'https\:\/\/www.youtube.com\/embed\/');
                        this.setState({[name]: url, showYTFrame: true, formValid: this.validator.allValid(), displayErrors4fields: errorFields});
                    }
                    else {
                        this.setState({[name]: url, showYTFrame: false, formValid: this.validator.allValid(), displayErrors4fields: errorFields});
                    }
                }
                else 
                    this.setState({[name]: ev.target.value, formValid: this.validator.allValid(), displayErrors4fields: errorFields});
                break;
        }

        if (!this.state.formValid) {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    submitFormHandler = (ev) => {
        ev.preventDefault();

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
                console.log(res);
            })
            .catch(err => {
                // handled in withErrorHandler
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
                // handled in withErrorHandler
            });

        axios.get('/body-part/all/')
            .then(res => {
                this.setState({engagedPartiesOptions: res.data});
            })
            .catch(err => {
                // handled in withErrorHandler
            });
    }

    render () {
        return (
            <div className={classes.AddExercise}>
                <h3>New Exercise:</h3>
                <div className={classes.AddExerciseFormContainer}>
                    <form onSubmit={this.submitFormHandler} className={classes.Form}>
                        <FormField 
                            label="Name"
                            type="text" 
                            name="name" 
                            required 
                            value={this.state.name} 
                            changed={this.formElementChangeHandler} 
                            blurred={this.checkNameBlurHandler}
                            placeholder="Exercise Name" 
                            validator={this.validator}
                            rules="required"
                            errors4Fields={this.state.displayErrors4fields} />


                        <FormField  
                            label="Description"
                            type="textarea"
                            name="description"
                            cols="40"
                            rows="4"
                            value={this.state.description}
                            changed={this.formElementChangeHandler} />

                        <FormField  
                            label="Set Unit"
                            type="selectbox"
                            name="setUnit"
                            value={this.state.setUnit}
                            changed={this.formElementChangeHandler}
                            options={[{value: 1, text: "Repetitions"}, {value: 2, text: "Seconds"}]} />

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

                        <FormField 
                            label="Photo"
                            type="file" 
                            name="file"
                            value={this.state.file} 
                            changed={this.formElementChangeHandler} />

                        <FormField 
                            label="Link to YT"
                            type="text" 
                            name="ytUrl" 
                            required 
                            value={this.state.ytUrl} 
                            changed={this.formElementChangeHandler}
                            placeholder="YT link" />
                            {this.state.showYTFrame ? <div className={classes.YTContainer}>
                            <iframe width="100%"  title="Exercise YT Video"
                                src={this.state.ytUrl} 
                                frameBorder="0" 
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                ></iframe>
                                </div>: null}

                        <label className={classes.FormElement}>
                            <FormField
                                type="button"
                                name="Create" />
                        </label><br />
                    </form>
                </div>
                <hr />
            </div>
        );
    }
}

export default withErrorHandler(AddExercise, axios);