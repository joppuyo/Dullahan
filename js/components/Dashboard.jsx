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
        this.user = JSON.parse(localStorage.getItem('user'));
    }
    render() {
        return (
            <div>
                <div className="top-bar">
                    <div className="top-bar-logo"></div>
                        <div className="top-bar-user">
                            <div className="top-bar-user-name">{this.user ? this.user.email : ''}</div>
                            <div className="top-bar-user-dropdown-arrow test"></div>
                        </div>
                </div>
                <div className="app-container">
                    <Navbar/>
                    <div className="app-content">{this.props.children}</div>
                </div>
            </div>
        )
    }
}