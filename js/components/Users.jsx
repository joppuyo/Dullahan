import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import SectionHeader from './SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import 'whatwg-fetch';
import ListItem from './ListItem.jsx';

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: []};
    }
    componentDidMount() {
        fetch('/api/users', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'X-Access-Token': localStorage.getItem('token'),
            }
        }).then(response => {
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
            console.log(data);
            this.setState({users: data});
        })
    }

    render() {
        return (
            <DocumentTitle title="Users - Dullahan">
                <div className="section-wrapper">
                    <SectionHeader title="Users">
                    </SectionHeader>
                    {this.state.users.map(user =>
                        <ListItem
                        title={user.email}
                        subtitle={user.email}
                        key={user.id}
                        image="/assets/icons/icon-user-avatar-placeholder.svg"
                        />
                    )}
                </div>
            </DocumentTitle>
        )
    }
}