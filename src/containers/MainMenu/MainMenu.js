import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classes from './MainMenu.module.css';
import MainMenuElement from '../../components/Navigation/MainMenuElement/MainMenuElement';
import Aux from '../../hoc/Auxiliary';
import Backdrop from '../../components/UI/Backdrop/Backdrop';
import CloseArrow from '../../components/UI/CloseArrow/CloseArrow';
import axios from '../../axios-dev';
// import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import isAuthenticated from '../../auth/auth';
import ButtonLink from '../../components/UI/ButtonLink/ButtonLink';


class MainMenu extends Component {

    routes = [
        {
            name: 'Home',
            path: 'home',
            exact: true
        },
        {
            name: 'Training',
            path: 'training',
            exact: true
        },
        {
            name: 'History',
            path: 'training-history',
            exact: true
        },
        {
            name: 'Plan Configurator',
            path: 'plan-conf',
            exact: true
        },
        {
            name: 'Profile',
            path: 'profile',
            exact: true
        },
        {
            name: 'Add Exercise',
            path: 'create-exercise',
            exact: true
        }
    ];

    logoutHandler = (ev) => {
        localStorage.removeItem('user_id');
        axios.get('/auth/logout')
        .then(response => {
            console.log(this.props.history);
            console.log(this.props);
            this.props.backdropClicked();            
            this.props.history.push('/home');
        })
        .catch(err => {
            console.log(err);
            // todo: redirect or something
        });
    }

    render () {         
        
        let attachedClasses = [classes.MainMenu, classes.Close];
        if (this.props.showMenu) {
            attachedClasses = [classes.MainMenu, classes.Open];
        }
        return (
            <Aux>
                <Backdrop show={this.props.showMenu} clicked={this.props.backdropClicked} />
                <div className={attachedClasses.join(' ')}>
                <CloseArrow closePanel={this.props.backdropClicked} />
                    <div className={classes.MainMenuContainer}>
                    {this.routes.map((x, index) => (<MainMenuElement 
                        key={index}
                        click={this.props.backdropClicked} 
                        name={x.name} 
                        path={x.path}
                        exact={x.exact} />))}
                    </div>
                   <div className={classes.MenuFooter} > {isAuthenticated() ? <ButtonLink clicked={this.logoutHandler}>Logout</ButtonLink> : null}</div>
                </div>
            </Aux>

        );
    }
}

export default withRouter(MainMenu);