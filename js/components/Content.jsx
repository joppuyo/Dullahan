import React from 'react';
import { hashHistory, Link } from 'react-router';
import SectionHeader from './SectionHeader.jsx';

export default class Content extends React.Component {
    render() {
        return (
            <SectionHeader title="Content"/>
        )
    }
}