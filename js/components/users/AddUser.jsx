import React from 'react';
import SectionHeader from '../SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import { Link, hashHistory } from 'react-router';
import _ from 'underscore';
import FetchService from '../../services/FetchService';
import SectionHeaderRight from '../SectionHeaderRight.jsx';

export default class AddUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showPassword: false,
            email: null,
            password: null,
        };
    }

    onTogglePasswordInput(event) {
        this.setState(_.extend(this.state, { showPassword: event.target.checked }));
    }

    onEmailInput(event) {
        this.setState(_.extend(this.state, { email: event.target.value }));
    }

    onPasswordInput(event) {
        this.setState(_.extend(this.state, { password: event.target.value }));
    }

    onSubmit(event) {
        let request = {
            email: this.state.email,
            password: this.state.password,
        };
        FetchService.post('api/register', request).then((response) => {
            hashHistory.push('/users');
        }).catch((response) => {
            // TODO: improve error handling
            const errors = response.data.map(error => error.message).join(', ');
            alert('Could not add a new user because of the following errors: ' + errors);
        });
    }

    render() {
        let passwordInputType = null;

        if (this.state.showPassword) {
            passwordInputType = 'text';
        } else {
            passwordInputType = 'password';
        }

        return (
            <DocumentTitle title="Add User - Dullahan">
                <div className="section-wrapper">
                    <SectionHeader title="Add user">
                        <SectionHeaderRight>
                            <Link to="/users" className="btn btn-default">Cancel</Link>
                            <button className="btn btn-primary" onClick={this.onSubmit.bind(this)}>Add user</button>
                        </SectionHeaderRight>
                    </SectionHeader>
                    <div className="items-container">
                        <div className="section-body">
                            <form>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" className="form-control" onInput={this.onEmailInput.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control" onInput={this.onPasswordInput.bind(this)} />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input type={passwordInputType} className="form-control" />
                                    <div className="checkbox">
                                        <label>
                                            <input type="checkbox" checked={this.state.showPassword} onChange={this.onTogglePasswordInput.bind(this)} /> Show password
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
