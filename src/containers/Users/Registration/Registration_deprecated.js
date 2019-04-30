import React from 'react';
import { Redirect } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

import classes from './Registration.module.css';
import axios from '../../../axios-dev';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import FormField from '../../../components/UI/FormField/FormField_deprecated';
import SpinnerCircle from '../../../components/UI/SpinnerCircles/SpinnerCircles';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';
import { isCorrectDate, isDob } from '../../../utils/utility';

class Registration extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            login: "",
            email: "",
            password: "",
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
        this.validator = new SimpleReactValidator(
            {
                validators: {
                    password: {
                        message: "Password must be 6+ chars long, contain number and uppercase and lowercase letter.",
                        rule: (val, params, validator) => {
                            return (new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)).test(val);
                        },
                    },
                    passwordConfirmation: {  // name the rule
                        message: 'The passwords do not match.',
                        rule: (val, params, validator) => {
                            return val[0] === val[1];
                        },
                        // messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                        //required: true  // optional
                    },
                    formatDate: {
                        message: "Must be a valid date.",
                        rule: (val, params, validator) => {
                            return isCorrectDate(val);
                        }
                    },
                    dob: {
                        message: "Not a valid date of birth.",
                        rule: (val, params, validator) => {
                            return isDob(val);
                        }
                    },
                    fileSize: {
                        message: 'File size limit is 2MB.',
                        rule: (val, params, validator) => {
                            return val.size < (2 * 1024 * 1024);
                        }
                    },
                    fileType: {
                        message: 'File type can be only png, jpg or gif.',
                        rule: (val, params, validator) => {
                            return val.type === 'image/png' || val.type === 'image/jpeg' || val.type === 'image/gif';
                        }
                    }
                }
            }
        );
    }

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
                break;
        }      
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
                this.setExistsValue(target.name, res.data.inUse);
            })
            .catch(err => console.log(err));
    }

    validateValueBlurHandler = (ev) => {
        const target = ev.target;
        if (target.value !== ''){
            this.validateValue(target);
        }
        else {
            this.setExistsValue(ev.target.name, false);
        }
        this.checkSimplyValidator(ev.target.name, ev.target.value);
        this.validator.showMessages();
        this.forceUpdate();
    }

    showErrorsBlurHandler = (ev) => {
        this.checkSimplyValidator(ev.target.name, ev.target.value);
        this.validator.showMessages();
        this.forceUpdate();
    }

    checkSimplyValidator = (name, value) => {
        let errorFields = [...this.state.displayErrors4fields];
        switch (name) {
            case 'file':
            case 'dob':
                const posInErrors = errorFields.indexOf(name);
                if (value === "" && posInErrors > -1) {
                    errorFields.splice(posInErrors, 1);
                }
                else if (value !== "" && posInErrors === -1) {
                    errorFields.push(name);
                }
                break;
        
            default: // password, confirmPassword, login, email
                if (value !== "" && errorFields.indexOf(name) === -1) {
                    errorFields.push(name);
                }
                break;
        }

        this.setState({formValid: this.validator.allValid(), displayErrors4fields: errorFields});  
    }

    submitFormHandler = (ev) => {
        let formOk = true;
        const validatorFields = this.validator.fields;
        for(let i = validatorFields-1; i >= 0; i--) {
            if (!validatorFields[i]) {
                formOk = false;
                break;
            }
        }
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
        console.log(this.state.avatar.name);
        // for (var key of formdata.entries()) {
        //     console.log(key[0] + ', ' + key[1])
        // }

        axios.post('/auth/register', formdata, {
            onUploadProgress: ProgressEvent => {
                console.log('Uploaded: '+Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)+'%.');
            }
        })
        .then(res => {
            if (res.data.successful) {
                this.setState({validationErrors: res.data.errors});
                window.scrollTo(0, 0);
            }
            else {
                this.setState({redirect: true});
            }
        })
        .catch(err => {

        })
        .finally(() => {
            this.setState({showSpinner: false});
        })
    }

    render () {

        const validationErrors = this.state.validationErrors.map((x, index) => {
            return <p key={index}>{(x.param ? x.param+": ":"") + x.msg}</p>
        });

        let formOk = true;

        const values = Object.values(this.validator.fields);
        console.log(this.validator.fields);

        if (this.emailExists || this.state.loginExists || values.length < 4) {
            formOk = false;
        }
        else {
            for (let index = 0; index < values.length; index++) {
                if (values[index] === false) {
                    formOk = false;
                    break;
                }
            }
        }

        return (
            <div className={classes.Registration} >
                {/* {this.state.redirect ? <Redirect to="/" exact /> : null} */}
                <Backdrop show={this.state.showSpinner} /> 
                {this.state.showSpinner ? <div className={classes.SpinnerWrapper}><SpinnerCircle /></div> : null}
                <h3>Registration</h3>
                <div>
                    {validationErrors.length > 0 ? <div className={classes.Error}>{validationErrors}</div> : null}
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
                            rules="required|alpha_num|min:2"
                            errors4Fields={this.state.displayErrors4fields}
                            additionalError={this.state.loginExists ? "Login in use." : null} />

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
                            rules="required|email"
                            errors4Fields={this.state.displayErrors4fields}
                            additionalError={this.state.emailExists ? "Email in use." : null} />
                        
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
                            rules="required|password"
                            errors4Fields={this.state.displayErrors4fields} />

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
                            validatorValues={[this.state.password, this.state.passwordConfirmation]}
                            rules="required|passwordConfirmation"
                            errors4Fields={this.state.displayErrors4fields} />

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
                            rules="formatDate|dob"
                            errors4Fields={this.state.displayErrors4fields} />

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
                            rules="fileSize|fileType"
                            errors4Fields={this.state.displayErrors4fields} /> 

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

export default withErrorHandler(Registration, axios);