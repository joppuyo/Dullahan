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
                icon: 'icon-nav-content',
            },
            {
                name: 'Media',
                active: false,
                url: 'media',
                icon: 'icon-nav-media',
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
    return <Link to={props.url} className="side-nav-item-wrapper" activeClassName="side-nav-item-wrapper-active">
        <div className="side-nav-item">
            <div className="side-nav-item-icon" style={{backgroundImage: `url("/assets/icons/${props.icon}.svg")` }}></div>
            <div className="side-nav-item-text">{props.name}</div>
        </div>
    </Link>
}