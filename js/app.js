import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router';

import App from './components/App.jsx';
import LoginBox from './components/LoginBox.jsx';
import Dashboard from './components/Dashboard.jsx';
import Content from './components/Content.jsx';
import ContentView from './components/ContentView.jsx';
import Media from './components/Media.jsx';
import DocumentTitle from 'react-document-title';
import Users from './components/Users.jsx';
import AddUser from './components/AddUser.jsx';
import ContentCreate from './components/ContentCreate.jsx';

ReactDOM.render(
    <DocumentTitle title="Dullahan">
        <Router history={hashHistory}>
                <Route path="/" component={App} />
                <Route path="/login" component={LoginBox} />
                <Route path="/app" component={Dashboard}>
                    <Route path="/content" component={Content} />
                    <Route path="/content/create/:contentTypeSlug" component={ContentCreate} />
                    <Route path="/content/:contentId" component={ContentView} />
                    <Route path="/media" component={Media} />
                    <Route path="/users" component={Users} />
                    <Route path="/users/add" component={AddUser} />
                </Route>
        </Router>
    </DocumentTitle>, document.getElementById('app')
);
