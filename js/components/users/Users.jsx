import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';
import SectionHeader from '../SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import ListItem from '../ListItem.jsx';
import FetchService from '../../services/FetchService';
import SectionHeaderRight from '../SectionHeaderRight.jsx';

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
                        <SectionHeaderRight>
                            <Link to="users/add" className="btn btn-primary media-upload-button">Add user</Link>
                        </SectionHeaderRight>
                    </SectionHeader>
                    <div className="items-container">
                        {this.state.users.map(user =>
                            <ListItem
                            title={user.email}
                            subtitle={user.email}
                            key={user.id}
                            image="/assets/icons/icon-user-avatar-placeholder.svg"
                            />
                        )}
                    </div>
                </div>
            </DocumentTitle>
        )
    }
}
