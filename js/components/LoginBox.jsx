import React from 'react';
import { hashHistory } from 'react-router';
import DocumentTitle from 'react-document-title';
import FetchService from '../services/FetchService.js';

export default class LoginBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {email: '', password: ''}
    }

    onLoginSubmit(event){
        event.preventDefault();
        var credentials = {
            email: this.state.email,
            password: this.state.password,
        };
        FetchService.post('/api/login', credentials)
            .then((data) => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                hashHistory.push('/content');
            })

    }

    onEmailInput(event){
        this.setState({email: event.target.value, password: this.state.password});
    }

    onPasswordInput(event){
        this.setState({password: event.target.value, email: this.state.email});
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
                                <input className="form-control" type="text" id="email" onInput={this.onEmailInput.bind(this)}/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input className="form-control" type="password" id="password" onInput={this.onPasswordInput.bind(this)}/>
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
