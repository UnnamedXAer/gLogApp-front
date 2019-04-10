import React from 'react';
import { Redirect } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

import classes from './Registration.module.css';
import axios from '../../../axios-dev';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import FormField from '../../../components/UI/FormField/FormField';

class Registration extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            login: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            dob: "",
            avatar: null,
            redirect: false,
            validationErrors: [],
            displayErrors4fields: []
        }

        this.imgPreviewRef = React.createRef();
        this.validator = new SimpleReactValidator(
            {
                validators: {
                    passwordConfirmation: {  // name the rule
                        message: 'The passwords do not match.',
                        rule: (val, params, validator) => {
                            return val[0] === val[1];
                        },
                        messageReplace: (message, params) => message.replace(':values', this.helpers.toSentence(params)),  // optional
                        //required: true  // optional
                    }
                }
            }
        );
    }

    formElementChangeHandler = (ev) => {
        const name = ev.target.name;

        let errorFields = [...this.state.displayErrors4fields];
        switch (name) {
            case 'file':
            case 'dob':
                const posInErrors = errorFields.indexOf(name);
                if (ev.target.value === "" && posInErrors > -1) {
                    errorFields.splice(posInErrors, 1);
                }
                else if (ev.target.value !== "" && posInErrors === -1) {
                    errorFields.push(name);
                }
                break;
        
            default: // password, confirmPassword, login, email
                if (ev.target.value !== "" && errorFields.indexOf(name) === -1) {
                    errorFields.push(name);
                }
                break;
        }


        switch (ev.target.type) {
            case 'file':
                this.setState({[name]: ev.target.files[0], formValid: this.validator.allValid(), displayErrors4fields: errorFields});

                const file = ev.target.files[0];
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
                this.setState({[name]: ev.target.value, formValid: this.validator.allValid(), displayErrors4fields: errorFields});
                break;
        }

        if (!this.state.formValid) {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    validateValue (target) {
        // TODO validate on client side

        axios.get('/user/registration/validate/', {name: target.name, value: target.value})
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log('validateValue\n', err));
    }

    validateValueBlurHandler = (ev) => {
        const target = ev.target;
        if (target.value !== '' && this.state.formValid && (target.type === 'text' || target.type === 'email' ) ){

            this.validateValue(target);
        }
        else {
            this.setState({nameError: false});
        }
    }

    submitFormHandler = (ev) => {
        ev.preventDefault();

        const formdata = new FormData();
        formdata.append('login', this.state.login);
        formdata.append('email', this.state.email);
        formdata.append('password', this.state.password);
        formdata.append('passwordConfirmation', this.state.passwordConfirmation);
        formdata.append('dob', this.state.dob);
        formdata.append('file', this.state.avatar, this.state.login+Date.now()+'.jpg'); // keep file last...

        // for (var key of formdata.entries()) {
        //     console.log(key[0] + ', ' + key[1])
        // }

        axios.post('/user/new', formdata, {
            onUploadProgress: ProgressEvent => {
                console.log('Uploaded: '+Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)+'%.');
            }
        })
        .then(res => {
            if (res.data.errors) {
                this.setState({validationErrors: res.data.errors});
                window.scrollTo(0, 0);
            }
            else {
                this.setState({redirect: true});
            }
        })
        .catch(err => {

        })
    }

    render () {

        const validationErrors = this.state.validationErrors.map((x, index) => {
            return <p key={index}>{(x.param ? x.param+": ":"") + x.msg}</p>
        });


        return (
            <div className={classes.Registration} >
                {this.state.redirect ? <Redirect to="/" exact /> : null}
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
                            errors4Fields={this.state.displayErrors4fields} />

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
                            errors4Fields={this.state.displayErrors4fields} />
                        
                        <FormField 
                            label="Password" 
                            type="password" 
                            name="password" 
                            required 
                            value={this.state.password} 
                            changed={this.formElementChangeHandler} 
                            blurred={this.validateValueBlurHandler}
                            placeholder="Password"
                            validator={this.validator}
                            rules="required|min:6"
                            errors4Fields={this.state.displayErrors4fields} />

                        <FormField 
                            label="Confirm Password" 
                            type="password" 
                            name="passwordConfirmation" 
                            required 
                            value={this.state.passwordConfirmation} 
                            changed={this.formElementChangeHandler} 
                            blurred={this.validateValueBlurHandler}
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
                            blurred={this.validateValueBlurHandler}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
                            placeholder="Date of birth" />


                        <label>Select avatar: 
                            <Input 
                                type="file" 
                                name="avatar" 
                                changed={this.formElementChangeHandler} 
                                placeholder="Avatar - picture"/>
                        </label>

                        <label>
                            <img src={require("../../../img/avatar-blank.png")} ref={this.imgPreviewRef} alt="Avatar" />
                        </label>

                        <label>
                            <Input type="submit" name="submit" value="Go" />
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

export default withErrorHandler(Registration, axios);