import React from 'react';
import { hashHistory } from 'react-router';
import DocumentTitle from 'react-document-title';

export default class LoginBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {email: '', password: ''}
    }

    onLoginClick(){
        var credentials = {
            email: this.state.email,
            password: this.state.password,
        };

        fetch('/api/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                hashHistory.push('/app')
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
                        <div className="login-box-right">
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
                            <button className="btn btn-primary pull-right" onClick={this.onLoginClick.bind(this)}>Login</button>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}