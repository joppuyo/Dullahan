import React from 'react';
import { hashHistory, Link } from 'react-router';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        // If user does not have token, redirect to login
        // TODO: validate token in backend
        if (!localStorage.getItem('token')) {
            hashHistory.push('/login')
        }

        this.navItems = [
            {
                name: 'Content',
                active: true,
                url: 'content',
            },
            {
                name: 'Media',
                active: false,
                url: 'media',
            },
        ]
    }
    render() {
        return (
            <div className="side-nav">
                {this.navItems.map(item => <NavItem {...item}/>)}
            </div>
        )
    }
}

function NavItem (props) {
    return <Link to={props.url} className="side-nav-item" activeClassName="side-nav-item-active">{props.name}</Link>
}