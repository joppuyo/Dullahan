import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';

export default class ListItem extends React.Component {
    render() {
        return (
            <div className="list-item clearfix">
                <div className="list-item-icon"/>
                <div className="list-item-right">
                    <div className="list-item-title">{this.props.title}</div>
                    <div className="list-item-subtitle">{this.props.subtitle}</div>
                </div>
            </div>
        )
    }
}