import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from '../../../axios-dev';
import classes from './Login.module.css';
import SpinnerCircle from '../../../components/UI/SpinnerCircles/SpinnerCircles';
import Backdrop from '../../../components/UI/Backdrop/Backdrop';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import Input from '../../../components/UI/Input/Input';
// to read

//https://reactjs.org/docs/render-props.html
//https://reactjs.org/docs/hooks-overview.html#building-your-own-hooks



class Login extends React.Component {

    state = {
        login: "",
        password: "",
        showSpinner: false,
        redirect: false,
        validationErrors: []
    }

    inputChangeHandler = (ev) => {
        this.setState({[ev.target.name]: ev.target.value});
    }

    formSubmitHandler = (ev) => {
        console.log('form submit');
        ev.preventDefault();
        const { login, password } = this.state;
        if (login.length === 0 || password.length === 0) {
            this.setState({validationErrors: [{param: 'Login & Password', msg: 'Cannot be empty.'}]});
        }
        else {
            this.setState({showSpinner: true});
            axios.post('/auth/login', {login: login, password: password})
                .then(res => {
                    if (res.data.errors) {
                        this.setState({validationErrors: res.data.errors, showSpinner: false});
                    }
                    else {
                        localStorage.setItem('user_id', res.data.user.id);
                        console.log(localStorage.getItem('user_Id'));
                        this.setState({redirect: true});
                    }
                })
                .catch(err => {
                    this.setState({showSpinner: false});
                });
        }
    }

    render () {

        const validationErrors = this.state.validationErrors.map((x, index) => { 
            return <p key={index}>{(x.param ? x.param+": ":"") + x.msg}</p>
        });

        return (
            <div className={classes.Login} >
                {this.state.redirect ? <Redirect to={(this.props.location.state || { from: { pathname: '/home' } })} /> : null}
                <Backdrop show={this.state.showSpinner} /> 
                {this.state.showSpinner ? <div className={classes.SpinnerWrapper}><SpinnerCircle /></div> : null}
                <form onSubmit={this.formSubmitHandler} >
                    <label>
                        <Input type="text" name="login" required placeholder="Login" value={this.state.login} changed={this.inputChangeHandler} />
                    </label>
                    <label>
                        <Input type="password" name="password" required placeholder="Password" value={this.state.password} changed={this.inputChangeHandler} />
                    </label>
                    {validationErrors.length > 0 ? <div className={classes.Error}>{validationErrors}</div> : null}
                    <label>
                       <button className={classes.Button} disabled={this.state.showSpinner} >Login</button>
                    </label>
                </form>
            </div>
        );
    }
}

export default withErrorHandler(Login, axios);