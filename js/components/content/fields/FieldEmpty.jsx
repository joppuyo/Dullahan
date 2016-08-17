import React from 'react';

export default class FieldEmpty extends React.Component {
    render() {
        return (
            <div className="field field-text">
                <div className="field-name">{this.props.name}</div>
                <div className="field-text-value field-text-value-null">No value</div>
            </div>
        );
    }
}
