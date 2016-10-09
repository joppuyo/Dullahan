import React from 'react';
import { hashHistory } from 'react-router';
import DocumentTitle from 'react-document-title';
import FetchService from '../services/FetchService.js';

export default class LoginBox extends React.Component {
    onLoginSubmit(event) {
        event.preventDefault();
        const credentials = {
            email: this.refs.email.value,
            password: this.refs.password.value,
        };
        FetchService.post('/api/login', credentials)
            .then((data) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                hashHistory.push('/content');
            });
    }

    render() {
        return (
            <DocumentTitle title="Login - Dullahan">
                <div className="login-container">
                    <div className="login-box">
                        <div className="login-box-left"></div>
                        <form className="login-box-right" onSubmit={this.onLoginSubmit.bind(this)}>
                            <h1 className="login-header">User Login</h1>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input className="form-control" type="text" id="email" ref="email" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input className="form-control" type="password" id="password" ref="password" />
                            </div>
                            <button className="btn btn-link pull-left">Lost password?</button>
                            <button type="submit" className="btn btn-primary pull-right">Login</button>
                        </form>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
