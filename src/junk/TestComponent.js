import React from 'react';
import Spinner from '../components/UI/Spinner/Spinner'
import SpinnerCircles from '../components/UI/SpinnerCircles/SpinnerCircles'

class TestComponent extends React.Component {

    render () {
        return <div>
            <div style={{width: '50%', height: '100px'}} ><Spinner /></div>
            <div style={{width: '50%', height: '100px'}} ><SpinnerCircles /></div>
        </div>;
    }
}

export default TestComponent;