import React from 'react';
import { Redirect } from 'react-router-dom';
import Validator from '../../utils/Validator';
import classes from './AddExercise.module.css';
import axios from '../../axios-dev';
import Multiselect from '../Multiselect/Multiselect';
import FormField from '../../components/UI/FormField/FormField';
import Alert from '../../components/UI/Alert/Alert';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

class AddExercise extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            description: "",
            file: "",
            setUnit: "1",
            engagedParties: [], // {id, name} of body parts
            engagedPartiesOptions: [],
            accessory4Exercise: [], // {id, name} of exercises
            accessory4ExerciseOptions: [],
            exerciseIsAccessoryForExercises: [],
            exerciseIsAccessoryForExercisesOptions: [],
            ytUrl: '',
            showYTFrame: false,
            showSpinner: false,
            redirect: false,
            showAlert: false,
            validationErrors: []
        }
        this.imgPreviewRef = React.createRef();
        this.validator = new Validator([
            {
                name: 'name',
                rules: ['required', 'alpha_num_space', 'min', 'notAllowed'],
                params: {min: 2, notAllowed: ['null', 'undefined']}
            },
            {
                name: 'description',
                rules: ['required']
            },
            {
                name: 'file',
                rules: ['image', 'fileSize'],
                params: {fileSize: 2}
            },
            {
                name: 'setUnit',
                rules: ['required']
            },
            {
                name: 'ytUrl',
                rules: ['yt']
            }
        ]);

        this.validator.validateField("setUnit", this.state.setUnit);
    }

    formElementChangeHandler = (ev) => {
        const name = ev.target.name;

        switch (ev.target.type) {
            case 'file':
                const file = ev.target.files[0];
                if (!file) {    
                    this.imgPreviewRef.current.src = require("../../img/avatar-blank.png");
                }
                else {
                    var reader = new FileReader();
                    reader.onload = (event) => {
                        this.imgPreviewRef.current.src = event.target.result;
                    };

                    reader.readAsDataURL(file);
                }
                this.validator.validateField(name, file); 
                this.setState({[name]: file});
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
                        this.setState({[name]: url, showYTFrame: true});
                    }
                    else {
                        this.setState({[name]: url, showYTFrame: false});
                    }
                }
                else 
                    this.setState({[name]: ev.target.value});
                this.validator.validateField(name, ev.target.value); 
                break;
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
        formdata.append('file', _state.file, _state.name+Date.now()+'.jpg'); // keep file last...

        // for (var key of formdata.entries()) {
		// 	console.log(key[0] + ', ' + key[1]);
		// }

        axios.post('/exercise/new', formdata, {
                onUploadProgress: ProgressEvent => {
                    console.log('Uploaded: '+Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)+'%.');
                }
            })
            .then(res => {
                if (res.status === 201) {
                    console.log('Created', res);
                    this.setState({showSpinner: false, showAlert: true});
                }
                else {
                    this.setState({validationErrors: res.data.errors});
                    this.setState({showSpinner: false});
                }
            })
            .catch(err => {
                this.setState({showSpinner: false});
            });
    }

    nameBlurHandler = (ev) => {
        const target = ev.target;
        if (target.value !== ''){
            axios.get('/exercise/check-exists/?value='+target.value)
            .then(res => {
                if (res.data.inUse) {
                    this.validator.addCustomError(target.name, target.name + ' in use.');
                }
                else {
                    this.validator.removeCustomError(target.name);
                }
            })
            .finally(() => {
                this.setState({}); // trigger render method
            });
        }
    }

    getSelectedOptionsSelectHandler = (options, dataName) => {
        this.setState({[dataName]: options});
    }

    alertConfirmHandler = (ev) => {
        this.setState({redirect: true});
    }

    componentDidMount () {
        axios.get('/exercise/all/')
            .then(res => {
                this.setState({accessory4ExerciseOptions: res.data.data, exerciseIsAccessoryForExercisesOptions: res.data.data});
            })
            .catch(err => {

            });

        axios.get('/body-part/all/')
            .then(res => {
                this.setState({engagedPartiesOptions: res.data.data});
            })
            .catch(err => {
                
            });
    }

    render () {

        let formOk = true;

        const validationErrors = this.state.validationErrors.map((x, index) => {
            return <li key={index}>{(x.param ? x.param+": ":"") + x.msg}</li>
        });

        formOk = this.validator.allValid();

        console.log(formOk);

        return (
            <div className={classes.AddExercise}>
                <Alert show={this.state.showAlert} confirm={this.alertConfirmHandler} text="Exercise created." type="info"/>
                {this.state.redirect ? <Redirect to="/home" /> : null} 
                <h3>New Exercise:</h3>
                <div className={classes.AddExerciseFormContainer}>
                    {validationErrors.length > 0 ? <div className={classes.Error}><ul>{validationErrors}</ul></div> : null}
                    <form onSubmit={this.submitFormHandler} className={classes.Form}>
                        <FormField 
                            label="Name"
                            type="text" 
                            name="name" 
                            required 
                            value={this.state.name} 
                            changed={this.formElementChangeHandler}
                            blurred={this.nameBlurHandler}
                            placeholder="Exercise Name" 
                            validator={this.validator}
                             />


                        <FormField  
                            label="Description"
                            type="textarea"
                            name="description"
                            required
                            cols="40"
                            rows="4"
                            value={this.state.description}
                            changed={this.formElementChangeHandler}
                            validator={this.validator} 
                             />

                        <FormField  
                            label="Set Unit"
                            type="selectbox"
                            name="setUnit"
                            value={this.state.setUnit}
                            changed={this.formElementChangeHandler}
                            options={[{value: 1, text: "Repetitions"}, {value: 2, text: "Seconds"}]} 
                            validator={this.validator}
                             />

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
                            changed={this.formElementChangeHandler}
                            imgPreviewRef={this.imgPreviewRef}
                            validator={this.validator}
                             />

                        <FormField 
                            label="Link to YT"
                            type="text" 
                            name="ytUrl"  
                            value={this.state.ytUrl} 
                            changed={this.formElementChangeHandler}
                            validator={this.validator}
                            placeholder="YT link" />
                            {this.state.showYTFrame ? <div className={classes.YTContainer} >
                            <iframe width="100%"  title="Exercise YT Video"
                                src={this.state.ytUrl} 
                                frameBorder="0" 
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                                ></iframe>
                                </div>: null}

                        <label className={classes.FormElement}>
                            <FormField
                                disabled={!formOk || this.state.showSpinner} 
                                type="button"
                                name="Create"
                                 />
                        </label><br />
                    </form>
                </div>
                <hr />
            </div>
        );
    }
}

export default withErrorHandler(AddExercise, axios);