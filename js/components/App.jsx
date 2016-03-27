import React from 'react';
import LoginBox from './LoginBox.jsx';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loggedIn: false};
    }
    handleOnLogin() {
        this.setState({loggedIn: true});
    }
    render() {
        if (this.state.loggedIn) {
            return (
                <div><h1>You are logged in</h1></div>
            )
        } else {
            return (
                <LoginBox onLogin={this.handleOnLogin.bind(this)}></LoginBox>
            )
        }
    }
}