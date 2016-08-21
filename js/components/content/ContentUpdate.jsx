import React from 'react';

import DocumentTitle from 'react-document-title';
import SectionHeader from '../SectionHeader.jsx';
import SectionHeaderRight from '../SectionHeaderRight.jsx';
import FetchService from '../../services/FetchService';
import _ from 'underscore';
import __ from 'lodash';
import { Link, hashHistory } from 'react-router';
import FieldImageEditContainer from './fields/FieldImageEditContainer.jsx';
import FieldReferenceEditContainer from './fields/FieldReferenceEditContainer.jsx';
import FieldTextAreaEdit from './fields/FieldTextAreaEdit.jsx';
import FieldTextEdit from './fields/FieldTextEdit.jsx';
import FieldArrayEdit from './fields/FieldArrayEdit.jsx';

export default class ContentUpdate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentType: null,
            content: null,
            formData: {},
        };
    }

    componentDidMount() {
        FetchService.get(`api/content/all/${this.props.params.contentId}`, { expandData: false }).then((contentData) => {
            FetchService.get(`api/content-types/${contentData._contentType}`).then((contentTypeData) => {

                // Strip "private" properties from the object, they are prefixed with an underscore.
                // TODO: update this function when private properties are moved under their own meta key
                const formData = __.omitBy(contentData, (value, key) => __.startsWith(key, '_'));

                _.extend(this.state, { content: contentData });
                _.extend(this.state, { formData });
                this.setState(_.extend(this.state, { contentType: contentTypeData }));
                this.setState(_.extend(this.state, { documentTitle: `${this.state.content._title} - Dullahan` }));
            });
        });
    }

    render() {
        if (this.state.contentType) {
            return (
                <DocumentTitle title={`Edit ${this.state.contentType.name} - Dullahan`}>
                    <div className="section-wrapper">
                        <SectionHeader title={`Edit ${this.state.contentType.name}`}>
                            <SectionHeaderRight>
                                <Link to={`content/${this.state.content._id}`} className="btn btn-default">Cancel</Link>
                                <button onClick={this.updateContent.bind(this)} className="btn btn-primary">Save</button>
                            </SectionHeaderRight>
                        </SectionHeader>
                        <div className="items-container">
                            <div className="section-body">
                                {
                                    this.state.contentType.fields.map((field) => {
                                        if (field.type === 'text') {
                                            return (
                                                <FieldTextEdit key={field.slug} field={field} setFormValue={this.setFormValue.bind(this)} formData={this.state.formData} />
                                            );
                                        }
                                        if (field.type === 'image') {
                                            return (
                                                <FieldImageEditContainer key={field.slug} field={field} setFormValue={this.setFormValue.bind(this)} formData={this.state.formData} />
                                            );
                                        }
                                        if (field.type === 'reference') {
                                            return (
                                                <FieldReferenceEditContainer key={field.slug} field={field} setFormValue={this.setFormValue.bind(this)} formData={this.state.formData} />
                                            );
                                        }
                                        if (field.type === 'textarea') {
                                            return (
                                                <FieldTextAreaEdit key={field.slug} field={field} setFormValue={this.setFormValue.bind(this)} formData={this.state.formData} />
                                            );
                                        }
                                        if (field.type === 'array' && field.arrayOf && __.some(field.arrayOf, { type: 'components' })) {
                                            console.log(field);
                                            return (
                                                <FieldArrayEdit key={field.slug} field={field} setFormValue={this.setFormValue.bind(this)} formData={this.state.formData} />
                                            );
                                        }
                                        return null;
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </DocumentTitle>
            );
        }
        return false;
    }

    setFormValue(key, value) {
        const newFormField = { [key]: value };
        const newFormData = _.extend(this.state.formData, newFormField);
        this.setState(_.extend(this.state, { formData: newFormData }));
    }

    updateContent() {
        // TODO: error handling
        FetchService.put(`api/content/all/${this.state.content._id}`, this.state.formData).then((response) => {
            hashHistory.push(`content/${this.state.content._id}`)
        });
    }

}
