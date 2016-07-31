import React from 'react';
import { Link } from 'react-router';

export default class ListItem extends React.Component {
    render() {
        if (this.props.link) {
            return (
                <Link to={this.props.link} className="list-item-outer">
                    {this.renderItem()}
                </Link>
            );
        } else {
            return (
                this.renderItem()
            );
        }
    }

    renderItem() {
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
        );
    }
}
