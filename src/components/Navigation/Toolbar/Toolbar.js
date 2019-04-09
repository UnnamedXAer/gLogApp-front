import React from 'react';
import classes from './Toolbar.module.css';
import DrawerToggle from './DrawerToggle/DrawerToggle';

const toolbar = props => (
    <header className={classes.Toolbar}>
        <DrawerToggle click={props.drawerToggleClicked} />
        <div className={classes.ToolbarTitle}>{props.title}</div>
        <div className={classes.ToolbarLogo} >
            {/* <img src={require('../../../img/ezgif.com-resize (2).gif')} /> */}
        </div>
    </header>
);

export default toolbar;