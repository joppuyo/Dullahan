import React from 'react';

export default class FieldText extends React.Component {
    render() {
        return (
            <div className="field field-text">
                <div className="field-name">{this.props.name}</div>
                <div className="field-text-value">{this.props.value}</div>
            </div>
        );
    }
}
