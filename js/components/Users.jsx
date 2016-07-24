import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import SectionHeader from './SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import ListItem from './ListItem.jsx';
import FetchService from '../services/FetchService';

export default class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {users: []};
    }
    componentDidMount() {
        FetchService.get('/api/users').then(data => {
            console.log(data);
            this.setState(
                {
                    users: data
                }
            );
        })
    }

    render() {
        return (
            <DocumentTitle title="Users - Dullahan">
                <div className="section-wrapper">
                    <SectionHeader title="Users">
                        <Link to="users/add" className="btn btn-primary media-upload-button">Add user</Link>
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
