import React from 'react';
import FieldReferenceEdit from './FieldReferenceEdit.jsx';
import ReferencePicker from '../ReferencePicker.jsx';
import _ from 'underscore';
import FetchService from '../../../services/FetchService';

export default class FieldReferenceEditContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selected: false, modalOpen: false, data: null };
    }

    openReferencePicker() {
        this.setState(_.extend(this.state, { modalOpen: true }));
    }

    closeReferencePicker() {
        this.setState(_.extend(this.state, { modalOpen: false }));
    }

    changeValue(value) {
        this.props.setFormValue(this.props.field.slug, value);
        this.closeReferencePicker();
    }

    updateField() {
        if (_.has(this.props.formData, this.props.field.slug)) {
            const value = this.props.formData[this.props.field.slug];
            FetchService.get(`api/content/all/${value}`).then(data => {
                this.setState(_.extend(this.state, { selected: true, data: data }));
            });
        }
    }

    componentDidMount() {
        console.log('Reference field mounted');
        this.updateField();
    }

    componentWillReceiveProps() {
        console.log('Reference field updated');
        this.updateField();
    }

    render() {
        return (
            <div>
                <ReferencePicker
                    isOpen={this.state.modalOpen}
                    changeValue={this.changeValue.bind(this)}
                    closeReferencePicker={this.closeReferencePicker.bind(this)}
                    contentTypes={this.props.field.referenceTo}
                />
                <div className="field field-reference">
                    <div className="field-name">{this.props.field.name}</div>
                    {(() => {
                        if (!this.state.selected) {
                                return (
                                <div className="field-reference-value clearfix" onClick={this.openReferencePicker.bind(this)}>
                                    <div className="field-reference-value-image field-reference-value-image-add" />
                                    <div className="field-reference-value-text">
                                        <div className="field-reference-value-text-title field-reference-value-text-title-no-subtitle">Select reference</div>
                                    </div>
                                </div>
                        )}
                        if (this.state.selected) {
                        return (
                        <FieldReferenceEdit title={this.state.data._title} image={this.state.data._image}/>
                        );
                    }
                    })()}
                </div>
            </div>
        );
    }
}
