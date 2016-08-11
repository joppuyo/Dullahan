import React from 'react';
import { Link } from 'react-router';
import SectionHeader from '../SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import ListItem from '../ListItem.jsx';
import FetchService from '../../services/FetchService';
import SectionHeaderRight from '../SectionHeaderRight.jsx';
import _ from 'underscore';

export default class Apps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apps: [],
        };
    }

    componentDidMount() {
        FetchService.get('api/apps').then((apps) => {
            this.setState(_.extend(this.state, { apps: apps }));
        });
    }

    render() {
        if (this.state.apps) {
            return (
                <DocumentTitle title="Apps - Dullahan">
                    <div className="section-wrapper">
                        <SectionHeader title="Apps">
                            <SectionHeaderRight>
                                <Link to="#" className="btn btn-primary media-upload-button">Add app</Link>
                            </SectionHeaderRight>
                        </SectionHeader>
                        <div className="items-container">
                            {this.state.apps.map(app =>
                                <ListItem
                                    title={app.name}
                                    subtitle={app.name}
                                    key={app.id}
                                    image="/assets/icons/icon-app-placeholder.svg"
                                />
                            )}
                        </div>
                    </div>
                </DocumentTitle>
            );
        }
        return null;
    }
}
