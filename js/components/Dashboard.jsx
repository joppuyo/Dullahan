import React from 'react';
import { hashHistory } from 'react-router';

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
        return <h2>This is the app dashboard</h2>
    }
}