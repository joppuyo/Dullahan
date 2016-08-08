import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';

export default class FieldTextAreaEdit extends React.Component {

    changeValue(event) {
        this.props.setFormValue(this.props.field.slug, event.target.value);
    }

    render() {
        return (
            <div key={this.props.field.slug}>
                <label htmlFor={this.props.field.slug}>{this.props.field.name}</label>
                <div className="form-group">
                    <TextareaAutosize rows="3" className="form-control" onInput={this.changeValue.bind(this)} id={this.props.field.slug}/>
                </div>
            </div>
        );
    }
}
