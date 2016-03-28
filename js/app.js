import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';
import 'whatwg-fetch';

import App from './components/App.jsx';
import LoginBox from './components/LoginBox.jsx';
import Dashboard from './components/Dashboard.jsx';
import Content from './components/Content.jsx';
import Media from './components/Media.jsx';

ReactDOM.render(
    <Router history={hashHistory}>
        <Route path="/" component={App}/>
        <Route path="/login" component={LoginBox}/>
        <Route path="/app" component={Dashboard}>
            <Route path="/content" component={Content}/>
            <Route path="/media" component={Media}/>
        </Route>
    </Router>, document.getElementById('app')
);