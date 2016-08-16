import React from 'react';
import _ from 'underscore';

export default class FieldTextEdit extends React.Component {

    onTextFieldInput(fieldSlug, event) {
        this.props.setFormValue(fieldSlug, event.target.value);
    }

    render() {
        let value = null;
        if (_.has(this.props.formData, this.props.field.slug)) {
            value = this.props.formData[this.props.field.slug];
        }
        return (
            <div >
                <label htmlFor={this.props.field.slug}>{this.props.field.name}</label>
                <div className="form-group">
                    <input id={this.props.field.slug} className="form-control" type="text" onInput={this.onTextFieldInput.bind(this, this.props.field.slug)} defaultValue={value} />
                </div>
            </div>
        )
    }
}
