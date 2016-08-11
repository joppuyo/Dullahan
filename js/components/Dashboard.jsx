import React from 'react';
import { hashHistory } from 'react-router';
import FetchService from '../services/FetchService';

import Navbar from './Navbar.jsx';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
        };
    }

    render() {
        return (
            <div>
                <div className="top-bar">
                    <div className="top-bar-logo"></div>
                        <div className="top-bar-user">
                            <div className="top-bar-user-name">{this.state.user ? this.state.user.email : ''}</div>
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
