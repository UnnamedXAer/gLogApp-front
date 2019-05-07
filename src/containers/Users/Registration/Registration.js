import React from 'react';
// import { Redirect } from 'react-router-dom';

import Validator from '../../../utils/Validator';
import classes from './Registration.module.css';
import axios from '../../../axios-dev';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import FormField from '../../../components/UI/FormField/FormField';
import SpinnerCircle from '../../../components/UI/SpinnerCircles/SpinnerCircles';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';

class Form extends React.Component {

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
            showSpinner: false,
            nonUsedKey: null
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
                rules: ['required', 'email']
            },
            {
                name: 'password',
                rules: ['required', 'min', 'password'],
                params: {password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, min: 6}
            },
            {
                name: 'passwordConfirmation',
                rules: ['required', 'passwordConfirmation'],
                params: {passwordConfirmation: this.getPassword} // todo: wrong password passed
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

    getPassword= () => this.state.password;

    formElementChangeHandler = (ev) => {
        const name = ev.target.name;
        switch (ev.target.type) {

            case 'file':
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
                this.validator.validateField(name, file);  
                this.setState({[name]: file});
                break;
            default:
                this.validator.validateField(name, ev.target.value);  
                this.setState({
                    [name]: ev.target.value
                });
                break;
        }
    }


    validateValue (target) {

        axios.get(`/auth/check-exists?name=${target.name}&value=${target.value}`)
            .then(res => {
                if (res.data.inUse) {
                    this.validator.addCustomError(target.name, target.name + ' in use.');
                }
                else {
                    this.validator.removeCustomError(target.name);
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
    }

    submitFormHandler = (ev) => {
        ev.preventDefault();
        this.validator.validateAll(this.state);
        if (!this.validator.allValid()) {
            this.setState({ nonUsedKey: Date.now() } );
            return;
        }
        this.setState({showSpinner: true});
        
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


        axios.post('/auth/register', formdata, {
            onUploadProgress: ProgressEvent => {
                console.log('file uploaded: '+Math.round(ProgressEvent.loaded / ProgressEvent.total * 100)+'%.');
            }
        })
        .then(res => {
            if (res.status !== 201) {
                this.setState({validationErrors: res.data.errors});
                window.scrollTo(0, 0);
                this.setState({showSpinner: false});
            }
            else {
                this.props.history.push('/home');
            }
        })
        .catch(err => {
            this.setState({showSpinner: false});
        })
    }

    render () {
        console.log(this.state.nonUsedKey);
        let formOk = true;

        const validationErrors = this.state.validationErrors.map((x, index) => {
            return <li key={index}>{(x.param ? x.param+": ":"") + x.msg}</li>
        });

        formOk = this.validator.allValid();

        console.log(formOk);

        return (
            <div className={classes.Registration} >
                <Backdrop show={this.state.showSpinner} /> 
                {this.state.showSpinner ? <div className={classes.SpinnerWrapper}><SpinnerCircle /></div> : null}
                <h3>Registration</h3>
                <div>
                    {validationErrors.length > 0 ? <div className={classes.Error}><ul>{validationErrors}</ul></div> : null}
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
                            placeholder="Confirm password"
                            validator={this.validator}
                             />

                        <FormField 
                            label="Date of birth" 
                            type="date" 
                            name="dob" 
                            value={this.state.dob} 
                            changed={this.formElementChangeHandler} 
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