import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import store from "./js/store/store";
import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

window.zip.workerScriptsPath = "/lib/";

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
