import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute/privateRoute';
import classes from './App.module.css';
import Layout from './hoc/Layout/Layout';
import Training from './containers/Training/Training';
import Home from './components/Home/Home';
import Profile from './containers/Users/Profile/Profile';
import Registration from './containers/Users/Registration/Registration';
import Login from './containers/Users/Login/Login';
import AddExercise from './containers/AddExercise/AddExercise';
import PlanConfigurator from './containers/PlanConfigurator/PlanConfigurator';
import AnAuthorized from './components/UnAuthorized/UnAuthorized';
import Logout from './components/Logout/logout';
import TrainingHistory from './containers/TrainingHistory/TrainingHistory';
//import { ToastContainer, toast } from 'react-toastify'; // TODO: uninstall if not implemented

import TestComponent from './junk/TestComponent';

class App extends Component {

  render() {
    return (
        <BrowserRouter>
            <div className={classes.App}>
                <Layout>
                    <Switch>
                        <Route 
                            path="/test-component" exact
                            component={TestComponent}
                            />
                        <Route 
                            path="/logout" exact
                            component={Logout}
                            />
                        <Route
                            path="/un-authorized" exact
                            component={AnAuthorized}
                            />
                        <PrivateRoute
                            path="/training" exact
                            component={Training}
                            />
                        <Route
                            path="/home" exact
                            component={Home}
                            />
                        <PrivateRoute
                            path="/create-exercise" exact
                            component={AddExercise}
                            />
                        <PrivateRoute
                            path="/profile" exact
                            component={Profile}
                            />
                        <PrivateRoute
                            path="/plan-conf" exact
                            component={PlanConfigurator}
                            />
                        <Route
                            path="/registration" exact
                            component={Registration}
                            />
                        <Route
                            path="/login" exact
                            component={Login}
                            />
                        <Route
                            path="/training-history" exact
                            component={TrainingHistory}
                            />
                        <Route
                            path="/" exact activeElement
                            component={Home}
                            />
                    </Switch>
                </Layout>
                {/* <ToastContainer /> */}
            </div>
        </BrowserRouter>
    );
  }
}

export default App;
