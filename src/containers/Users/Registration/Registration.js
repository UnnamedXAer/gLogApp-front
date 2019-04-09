import React from 'react';
import { Redirect } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';

import classes from './Registration.module.css';
import axios from '../../../axios-dev';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';

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
            redirect: false
        }

        this.imgPreviewRef = React.createRef();
        this.validator = new SimpleReactValidator();
    }

    formElementChangeHandler = (ev) => {
        

        switch (ev.target.type) {
            case 'file':
                this.setState({[ev.target.name]: ev.target.files[0], formValid: this.validator.allValid()});


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
                this.setState({[ev.target.name]: ev.target.value, formValid: this.validator.allValid()});
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
            this.setState({redirect: true});
        })
        .catch(err => {

        })
    }


    render () {

        const validationErrors = [];


        return (
            <div className={classes.Registration} >
                {this.state.redirect ? <Redirect to="/" exact /> : null}
                <h3>Registration</h3>
                <div>
                    <form onSubmit={this.submitFormHandler}>
                        <label>Login: 
                            <Input type="text" name="login" required value={this.state.login} changed={this.formElementChangeHandler} blurred={this.validateValueBlurHandler} />
                            <span className={classes.Error}>{this.validator.message('login', this.state.login, 'required|alpha_num')}</span>
                            {validationErrors.length > 0 ? <div className={classes.Error}>{validationErrors}</div> : null}
                        </label>

                        <label>Email: 
                            <Input type="email" name="email" required value={this.state.email} changed={this.formElementChangeHandler} blurred={this.validateValueBlurHandler} />
                            <span className={classes.Error}>{this.validator.message('email', this.state.email, 'required|email')}</span>
                        </label>

                        <label>Password: 
                            <Input type="password" name="password" required value={this.state.password} changed={this.formElementChangeHandler} blurred={this.validateValueBlurHandler} />
                            <span className={classes.Error}>{this.validator.message('password', this.state.password, 'required')}</span>
                        </label>

                        <label>Confirm Password: 
                        <Input type="password" name="passwordConfirmation" required value={this.state.passwordConfirmation} changed={this.formElementChangeHandler} blurred={this.validateValueBlurHandler} />
                        </label>

                        <label>Date of birth: 
                            <Input type="date" name="dob" required value={this.state.dob} changed={this.formElementChangeHandler} blurred={this.validateValueBlurHandler}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" />
                        </label>

                        <label>Select avatar: 
                            <Input type="file" name="avatar" changed={this.formElementChangeHandler} />
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