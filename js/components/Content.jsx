import React from 'react';
import { hashHistory, Link } from 'react-router';
import SectionHeader from './SectionHeader.jsx';
import DocumentTitle from 'react-document-title';

export default class Content extends React.Component {
    render() {
        return (
            <DocumentTitle title="Content - Dullahan">
                <SectionHeader title="Content"/>
            </DocumentTitle>
        )
    }
}