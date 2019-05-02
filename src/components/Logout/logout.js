import React from 'react';
import { withRouter } from 'react-router-dom';
import axios from '../../axios-dev';

const logout = withRouter(({history}) => {
    localStorage.removeItem('user_id');
    axios.get('/auth/logout')
    .then(response => {
        history.push('/home');
    });
    return (<div>
        <h4><i>Logging out...</i></h4>
    </div>);
})

export default logout;