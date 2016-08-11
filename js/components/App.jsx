import React from 'react';
import { hashHistory } from 'react-router';
import FetchService from '../services/FetchService';

export default class App extends React.Component {
    componentDidMount() {
        // If there is no token, the user is not logged in
        if (!localStorage.getItem('token')) {
            hashHistory.push('/login');
        }
        // Let's try to see if the user session is valid
        FetchService.get('api/login').then((user) => {
            hashHistory.push('/content');
        }).catch((error) => {
            if (error.response.status === 401) {
                // TODO: error handling
                hashHistory.push('/login');
            }
        });
    }
    render() {
        return null;
    }
}
