import React from 'react';

export default class FieldBoolean extends React.Component {
    render() {
        let value = 'False';
        if (this.props.value === true) {
            value = 'True';
        }

        return (
            <div className="field field-text">
                <div className="field-name">{this.props.name}</div>
                <div className="field-text-value">{value}</div>
            </div>
        );
    }
}
