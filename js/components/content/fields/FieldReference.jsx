import React from 'react';
import FieldReferenceItem from './FieldReferenceItem.jsx';
import store from '../../../store';

export default class FieldReference extends React.Component {
    viewReference() {
        store.dispatch({ type: 'OPEN_INSPECTOR', schema: null, data: this.props.value });
    }
    render() {
        return (
            <div className="field field-reference" onClick={this.viewReference.bind(this)}>
                <div className="field-name">{this.props.name}</div>
                <FieldReferenceItem
                    image={this.props.value._image}
                    title={this.props.value._title}
                    subtitle={this.props.value._contentType}
                />
            </div>
        );
    }
}
