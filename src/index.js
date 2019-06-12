import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { checkSessionExpiration } from './auth/auth';

checkSessionExpiration();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();


// https://github.com/jiaweichiu/node-react-passport/blob/master/frontend/src/App.js
// https://www.npmjs.com/package/react-toastr