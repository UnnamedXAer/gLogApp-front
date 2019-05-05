import React from 'react';
// import { Redirect } from 'react-router-dom';

import Validator from '../../../utils/Validator';
import classes from './Registration.module.css';
import axios from '../../../axios-dev';
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import FormField from '../../../components/UI/FormField/FormField';
import SpinnerCircle from '../../../components/UI/SpinnerCircles/SpinnerCircles';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';

class Form extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            login: "",
            loginErrors: [],
            email: "",
            password: "ss",
            passwordConfirmation: "",
            dob: "",
            avatar: "",
            redirect: false,
            validationErrors: [],
            displayErrors4fields: [],
            loginExists: false,
            emailExists: false,
            formValid: false,
            showSpinner: false
        }

        this.imgPreviewRef = React.createRef();
        this.validator = new Validator([
            {
                name: 'login',
                rules: ['required', 'alpha_num', 'min', 'notAllowed'],
                params: {min: 2, notAllowed: ['admin', 'administrator', 'moderator', 'null', 'undefined']}
            },
            {
                name: 'email',
                rules: ['required', 'isEmail']
            },
            {
                name: 'password',
                rules: ['required', 'min', 'password'],
                params: {password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, min: 6}
            },
            {
                name: 'passwordConfirmation',
                rules: ['required', 'passwordConfirmation'],
                params: {passwordConfirmation: this.getStateParamValue('password')} // todo: wrongaosswordpassed
            },
            {
                name: 'dob',
                rules: ['formatDate', 'dob']
            },
            {
                name: 'avatar',
                rules: ['image', 'fileSize'],
                params: {fileSize: 2}
            },
        ]);
    }

    getStateParamValue = (name) => this.state[name];

    formElementChangeHandler = (ev) => {
        const name = ev.target.name;

        switch (ev.target.type) {
            case 'file':
                const file = ev.target.files[0];
                this.setState({[name]: file});

                if (!file) {    
                    this.imgPreviewRef.current.src = require("../../../img/avatar-blank.png");
                }
                else {
                    var reader = new FileReader();
                    reader.onload = (event) => {
                        this.imgPreviewRef.current.src = event.target.result;
                    };

                    reader.readAsDataURL(file);
                }
                this.validator.validateField(name, file);  
                break;
            default:
                if (name === 'login' || name === "email") {
                    this.setState({
                        [name]: ev.target.value,
                        [name+"Exists"]: false
                    });
                } 
                else {
                    this.setState({
                        [name]: ev.target.value
                    });
                }
                this.validator.validateField(name, ev.target.value);  
                break;
        }
            
        this.setState({[name+'Errors']: this.validator.getMessages(name)});
    }

    setExistsValue (name, inUse) {
        switch (name) {
            case 'login':
                this.setState({loginExists: inUse});
                break;
            case 'email':
                this.setState({emailExists: inUse});
                break;
            default:
                break;
        }
    }

    validateValue (target) {

        axios.get(`/user/check-exists?name=${target.name}&value=${target.value}`)
            .then(res => {
                //this.setExistsValue(target.name, res.data.inUse);
                if (res.data.inUse) {
                    this.validator.fields[target.name].customError = target.name + ' in use.';
                }
                else {
                    this.validator.fields[target.name].customError = "";
                }
                this.setState({[target.name+'Errors']: this.validator.getMessages(target.name)});
            })
            .catch(err => console.log(err));
    }

    validateValueBlurHandler = (ev) => {
        const target = ev.target;
        if (target.value !== ''){
            this.validateValue(target);
        }
        else {
            
        }

    }

    showErrorsBlurHandler = (ev) => {

    }

    submitFormHandler = (ev) => {

        console.log(this.validator.fields);

        this.setState({showSpinner: true});
        ev.preventDefault();
        console.log(this.state);
        const formdata = new FormData();
        formdata.append('login', this.state.login);
        formdata.append('email', this.state.email);
        formdata.append('password', this.state.password);
        formdata.append('passwordConfirmation', this.state.passwordConfirmation);
        formdata.append('dob', this.state.dob);
        formdata.append('file', this.state.avatar, this.state.avatar.name); // keep file last...
        // for (var key of formdata.entries()) {
        //     console.log(key[0] + ', ' + key[1])
        // }

        setTimeout(() => {this.setState({showSpinner: false});}, 200);

        // axios.post('/user/new', formdata, {
        //     onUploadProgress: ProgressEvent => {
        //         console.log('Uploaded: '+Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)+'%.');
        //     }
        // })
        // .then(res => {
        //     if (res.data.successful) {
        //         this.setState({validationErrors: res.data.errors});
        //         window.scrollTo(0, 0);
        //     }
        //     else {
        //         this.setState({redirect: true});
        //     }
        // })
        // .catch(err => {

        // })
        // .finally(() => {
        //     this.setState({showSpinner: false});
        // })
    }

    render () {

        let formOk = true;


        return (
            <div className={classes.Registration} >
                {/* {this.state.redirect ? <Redirect to="/" exact /> : null} */}
                <Backdrop show={this.state.showSpinner} /> 
                {this.state.showSpinner ? <div className={classes.SpinnerWrapper}><SpinnerCircle /></div> : null}
                <h3>form test</h3>
                <div>
                    <form onSubmit={this.submitFormHandler}>
                        <FormField 
                            label="Login"
                            type="text" 
                            name="login" 
                            required 
                            value={this.state.login} 
                            changed={this.formElementChangeHandler} 
                            blurred={this.validateValueBlurHandler}
                            placeholder="Login"
                            validator={this.validator}
                            />

                        <FormField 
                            label="Email"
                            type="email" 
                            name="email" 
                            required 
                            value={this.state.email} 
                            changed={this.formElementChangeHandler} 
                            blurred={this.validateValueBlurHandler}
                            placeholder="Email"
                            validator={this.validator}
                             />
                        
                        <FormField 
                            label="Password" 
                            type="password" 
                            name="password" 
                            required 
                            value={this.state.password} 
                            changed={this.formElementChangeHandler}
                            blurred={this.showErrorsBlurHandler}
                            placeholder="Password"
                            validator={this.validator}
                             />

                        <FormField 
                            label="Confirm Password" 
                            type="password" 
                            name="passwordConfirmation" 
                            required 
                            value={this.state.passwordConfirmation} 
                            changed={this.formElementChangeHandler}
                            blurred={this.showErrorsBlurHandler}
                            placeholder="Confirm password"
                            validator={this.validator}
                             />

                        <FormField 
                            label="Date of birth" 
                            type="date" 
                            name="dob" 
                            value={this.state.dob} 
                            changed={this.formElementChangeHandler} 
                            blurred={this.showErrorsBlurHandler}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                            placeholder="Date of birth"
                            validator={this.validator}
                             />

                        <FormField 
                            label="Select avatar" 
                            type="file" 
                            name="avatar" 
                            value={this.state.avatar} 
                            changed={this.formElementChangeHandler}
                            blurred={this.showErrorsBlurHandler}
                            imgPreviewRef={this.imgPreviewRef}
                            placeholder="Avatar - picture"
                            validator={this.validator}
                             /> 

                        <label>
                            <FormField 
                             disabled={!formOk || this.state.showSpinner} 
                            type="button" name="Go" value="Go" />
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

export default withErrorHandler(Form, axios);