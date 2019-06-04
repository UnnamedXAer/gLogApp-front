import React from 'react';
import classes from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';
import Aux from '../../../hoc/Auxiliary';
import CloseArrow from '../CloseArrow/CloseArrow';

class Modal extends React.Component {

    shouldComponentUpdate (nextProps, nextState) {
        return (nextProps.show !== this.props.show || nextProps.children !== this.props.children);
    }

    render () {
        const {width, height, show, overflow, zIndex} = this.props;

        let header = null;
        if (this.props.showHeader) {
            header =<div className={classes.Header}>
                <CloseArrow closePanel={this.props.modalClose} />
                <div className={classes.Title}>{this.props.title}</div>
            </div>
        }

        return ( // kind of wrapper for modal elements
            <Aux>
                <Backdrop show={show} clicked={this.props.modalClose} />
                <div className={classes.Modal} 
                    style={{ // is this breaking the @media - query?
                        zIndex: zIndex? zIndex:'500',
                        transform: show ? 'translateY(0)': 'translate(-100vw)',
                        opacity: show ? '1' : '0',
                        width: width ? (width+"%") : '70%', 
                        left: width ? (((100-width)/2)+"%") : "15%",
                        height: height ? (height+"%") : "70%",
                        top: height ? (((100-height)/2)+"%") : "15%",
                        overflow: overflow ? overflow : 'visible'
                    }} >
                    {header}
                    <div className={classes.Content} style={{height: (this.props.showHeader ? "calc(100% - 2.4em)" : "100%")}}>
                        {this.props.children}
                    </div>
                </div>
            </Aux>
        );
    }
}

export default Modal;