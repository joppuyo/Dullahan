import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import __ from 'lodash';

export default class FieldTextAreaEdit extends React.Component {

    changeValue(event) {
        this.props.setFormValue(this.props.field.slug, event.target.value);
    }

    render() {
        let value = null;
        if (__.has(this.props.formData, this.props.field.slug)) {
            value = this.props.formData[this.props.field.slug];
        }
        return (
            <div key={this.props.field.slug}>
                <label htmlFor={this.props.field.slug}>{this.props.field.name}</label>
                <div className="form-group">
                    <TextareaAutosize rows="3" className="form-control" onInput={this.changeValue.bind(this)} id={this.props.field.slug} defaultValue={value} />
                </div>
            </div>
        );
    }
}
