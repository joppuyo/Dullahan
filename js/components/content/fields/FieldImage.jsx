import React from 'react';

export default class FieldImage extends React.Component {
    render() {
        return (
            <div className="field field-image">
                <div className="field-name">{this.props.name}</div>
                <div className="field-image-image" style={{ backgroundImage: `url(${this.props.url})` }} />
            </div>
        );
    }
}
