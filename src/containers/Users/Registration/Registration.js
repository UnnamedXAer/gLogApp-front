import React from 'react';
import SimpleReactValidator from 'simple-react-validator';

import classes from './Registration.module.css';
import axios from '../../../axios-dev';


class Registration extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            login: "",
            email: "",
            password: "",
            passwordConfirmation: "",
            dob: "",
            avatar: null
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
        if (ev.target.value !== ''){

            this.validateValue(ev.target);
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
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        })
    }


    render () {
        return (
            <div className={classes.Registration} >
                <h3>Registration</h3>
                <div>
                    <form onSubmit={this.submitFormHandler}>
                        <label>Login: 
                            <input type="text" name="login" required value={this.state.login} onChange={this.formElementChangeHandler} onBlur={this.validateValueBlurHandler} />
                        </label><br />
                        <label>Email: 
                            <input type="email" name="email" required value={this.state.email} onChange={this.formElementChangeHandler} onBlur={this.validateValueBlurHandler} />
                            <span className={classes.Error}>{this.validator.message('login', this.state.login, 'required|alpha_num')}</span>
                        </label><br />
                        <label>Password: 
                            <input type="password" name="password" required value={this.state.password} onChange={this.formElementChangeHandler} onBlur={this.validateValueBlurHandler} />
                        </label><br />
                        <label>Confirm Password: 
                        <input type="password" name="passwordConfirmation" required value={this.state.passwordConfirmation} onChange={this.formElementChangeHandler} onBlur={this.validateValueBlurHandler} />
                        </label><br />
                        <label>Date of birth: 
                            <input type="date" name="dob" required value={this.state.dob} onChange={this.formElementChangeHandler} onBlur={this.validateValueBlurHandler}
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" />
                        </label><br />
                        <label>Select avatar: 
                            <input type="file" name="avatar" onChange={this.formElementChangeHandler} />
                        </label><br />
                        <label>
                            <img src={require("../../../img/avatar-blank.png")} ref={this.imgPreviewRef} alt="Avatar" />
                        </label><br />
                        <label>
                            <input type="submit" name="submit" value="Go" />
                        </label>
                    </form>
                </div>
            </div>
        );
    }
}

export default Registration;