import React from 'react';

export default class FieldReference extends React.Component {
    render() {
        return (
            <div className="field field-reference">
                <div className="field-name">{this.props.name}</div>
                <div className="field-reference-value clearfix">
                    <div className="field-reference-value-image" style={{ backgroundImage: `url(${this.props.image})` }} />
                    <div className="field-reference-value-text">
                        <div className="field-reference-value-text-title">{this.props.title}</div>
                        <div className="field-reference-value-text-subtitle">{this.props.subtitle}</div>
                    </div>
                </div>
            </div>
        );
    }
}
