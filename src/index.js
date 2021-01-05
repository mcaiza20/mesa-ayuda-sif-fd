import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Amplify from 'aws-amplify'

// import { BrowserRouter } from 'react-router-dom'

Amplify.configure({
    Auth:{
        mandatorySingIn: true,
        region: 'us-east-1',
        userPoolId: 'us-east-1_Ef5mPDH22',
        userPoolWebClientId:'1rcqi5fh7s087eg0354u9b96ps'
    }
})

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<BrowserRouter><App /></BrowserRouter> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
