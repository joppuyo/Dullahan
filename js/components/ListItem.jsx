import React from 'react';
import { Router, Route, Link, hashHistory } from 'react-router';

export default class ListItem extends React.Component {
    render() {
        let style = null;
        if (this.props.image) {
            style = { backgroundImage: `url(${this.props.image})` };
        }
        return (
            <div className="list-item clearfix">
                <div className="list-item-icon" style={style} />
                <div className="list-item-right">
                    <div className="list-item-title">{this.props.title}</div>
                    <div className="list-item-subtitle">{this.props.subtitle}</div>
                </div>
            </div>
        )
    }
}
