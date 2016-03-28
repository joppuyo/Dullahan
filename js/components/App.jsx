import React from 'react';
import LoginBox from './LoginBox.jsx';
import { Link } from 'react-router'

export default class App extends React.Component {
    render() {
        return <h1>I am app <Link to="/login">Login</Link></h1>
    }
}