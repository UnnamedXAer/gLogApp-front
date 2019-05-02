import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAuthenticated from '../../auth/auth';

const privateRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={(props) => {
            console.log(props.location);
            return (isAuthenticated() ? <Component {...props}/> : <Redirect to={{
                // pathname:'/un-authorized',
                pathname:'/login',
                state: {from: props.location} }} />)
        }} />
    )
}

export default privateRoute;


// https://tylermcginnis.com/react-router-protected-routes-authentication/