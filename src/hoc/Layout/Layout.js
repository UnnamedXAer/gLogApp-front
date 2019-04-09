import React from 'react';
import classes from './Layout.module.css';
import Aux from '../Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import MainMenu from '../../containers/MainMenu/MainMenu';

class Layout extends React.Component {
    state = {
        showMenu: false
    };

    drawerToggleClickHandler = () => {
        var sMenu = this.state.showMenu;
        this.setState({
            showMenu: !sMenu
        });
    }

    render () {
        return (
            <Aux>
                <Toolbar title="g-log-app" className={classes.AppHeader} drawerToggleClicked={this.drawerToggleClickHandler} />
                <MainMenu showMenu={this.state.showMenu} backdropClicked={this.drawerToggleClickHandler}/>
                <main className={classes.LayoutMain}>
                    {this.props.children /*components passed in <Layout> tag*/ } 
                </main>
            </Aux>
        );
    }
}

export default Layout;