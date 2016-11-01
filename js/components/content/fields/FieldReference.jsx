import React from 'react';
import FieldReferenceItem from './FieldReferenceItem.jsx';

export default class FieldReference extends React.Component {
    render() {
        return (
            <div className="field field-reference">
                <div className="field-name">{this.props.name}</div>
                <FieldReferenceItem
                    image={this.props.image}
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                />
            </div>
        );
    }
}
