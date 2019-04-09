import React, { Component } from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import classes from './App.module.css';
import Layout from './hoc/Layout/Layout';
import Training from './containers/Training/Training';
import Home from './components/Home/Home';
import Profile from './containers/Users/Profile/Profile';
import Registration from './containers/Users/Registration/Registration';
import Login from './containers/Users/Login/Login';
import AddExercise from './containers/AddExercise/AddExercise';
import PlanConfigurator from './containers/PlanConfigurator/PlanConfigurator';
//import { ToastContainer, toast } from 'react-toastify'; // TODO: uninstall if not implemented


class App extends Component {

  render() {

    return (
        <BrowserRouter>
            <div className={classes.App}>
                <Layout>
                <Switch>
                        <Route
                            path="/" exact activeElement
                            component={Home}
                            />
                        <Route
                            path="/home" exact activeElement
                            component={Home}
                            />
                        <Route
                            path="/training" exact
                            component={Training}
                            />
                        <Route
                            path="/create-exercise" exact
                            component={AddExercise}
                            />
                        <Route
                            path="/profile" exact
                            component={Profile}
                            />
                        <Route
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
                    </Switch>
                </Layout>
                {/* <ToastContainer /> */}
            </div>
        </BrowserRouter>
    );
  }
}

export default App;
