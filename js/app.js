import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';

class LoginBox extends React.Component {
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
            }).then(response => response.json())
            .then(data => {alert(data.token)})
    }

    onEmailInput(event){
        this.setState({email: event.target.value, password: this.state.password});
    }

    onPasswordInput(event){
        this.setState({password: event.target.value, email: this.state.email});
    }

    render() {
        return (
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
        );
    }
}

class App extends React.Component {
    render() {
        return (
            <div className="login-container">
                <LoginBox></LoginBox>
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);