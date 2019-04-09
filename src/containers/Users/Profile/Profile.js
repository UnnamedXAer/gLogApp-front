import React from 'react';
import classes from './Profile.module.css';
import axios from '../../../axios-dev';

class Profile extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            joinDate: '',
            password: '',
            password2: '',
            userLogoURL: '#',
            login: '',
            email: "",
            dob: "",
        }
    }

    passwordChangeHandler = (event) => {
        this.setState({[event.target.name]: event.target.value});
    } 

    async getUserData () {
        axios.get('/users/id/1')
        .then(response => {
            console.log('/users/id/1', response);
            const userData = response.data;
            this.setState({
                joinDate: userData.createdOn,
                //userLogoURL: userData.usImgURL,
                login: userData.login,
                email: userData.email,
                dob: userData.dob
            });
        })
        .catch(response => {
            console.log('- Profile: Get user data: ', response);
        })
    }

    componentDidMount () {
        this.getUserData();
    }

    render () {
        return (
            <div className={classes.Profile}>
                <h3>{this.state.login}</h3>
                <div>
                    <div>Join Date: <strong>{this.state.joinDate}</strong></div>
                    <div>Logo: <div><img alt="" src={this.state.userLogoURL}></img></div></div>
                    <div>Email: {this.state.email}</div>
                    <p>Change password:</p>
                    <input type="password" name="password" value={this.state.password} onChange={this.passwordChangeHandler} />
                    <input type="password" name="password2" value={this.state.password2} onChange={this.passwordChangeHandler} />
                </div>
            </div>
        );
    }
}


export default Profile;