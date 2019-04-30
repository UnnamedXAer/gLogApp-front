import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAuthenticated from '../../auth/auth';

const privateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={(props) => (
            isAuthenticated() ? <Component {...props}/> : <Redirect to="/un-authorized" />
        )} />
    )
}

export default privateRoute;


// https://tylermcginnis.com/react-router-protected-routes-authentication/