import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, IndexRoute } from 'react-router';

import App from './components/App.jsx';
import LoginBox from './components/LoginBox.jsx';
import Dashboard from './components/Dashboard.jsx';
import Content from './components/content/Content.jsx';
import ContentView from './components/content/ContentView.jsx';
import Media from './components/media/Media.jsx';
import DocumentTitle from 'react-document-title';
import Users from './components/users/Users.jsx';
import AddUser from './components/users/AddUser.jsx';
import ContentCreate from './components/content/ContentCreate.jsx';
import ContentUpdate from './components/content/ContentUpdate.jsx';
import Apps from './components/apps/Apps.jsx';
import viewportUnitsBuggyfill from 'viewport-units-buggyfill';
import { Provider } from 'react-redux';

import store from './store';

viewportUnitsBuggyfill.init();

ReactDOM.render(
    <Provider store={store}>
        <DocumentTitle title="Dullahan">
            <Router history={hashHistory}>
                <Route path="/login" component={LoginBox} />
                <Route path="/" component={Dashboard}>
                    <IndexRoute component={App} />
                    <Route path="content">
                        <IndexRoute component={Content} />
                        <Route path="create/:contentTypeSlug" component={ContentCreate} />
                        <Route path=":contentId" component={ContentView} />
                        <Route path=":contentId/edit" component={ContentUpdate} />
                    </Route>
                    <Route path="media">
                        <IndexRoute component={Media} />
                    </Route>
                    <Route path="users">
                        <IndexRoute component={Users} />
                        <Route path="add" component={AddUser} />
                    </Route>
                    <Route path="apps">
                        <IndexRoute component={Apps} />
                    </Route>
                </Route>
            </Router>
        </DocumentTitle>
    </Provider>, document.getElementById('app')
);
