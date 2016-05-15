import React from 'react';
import { hashHistory } from 'react-router';

import Navbar from './Navbar.jsx';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        // If user does not have token, redirect to login
        // TODO: validate token in backend
        if (!localStorage.getItem('token')) {
            hashHistory.push('/login')
        }
    }
    render() {
        return (
            <div>
                <div className="top-bar">
                    <div className="top-bar-logo"></div>
                </div>
                <div className="app-container">
                    <Navbar/>
                    <div className="app-content">{this.props.children}</div>
                </div>
            </div>
        )
    }
}