import React from 'react';

import DocumentTitle from 'react-document-title';
import SectionHeader from '../SectionHeader.jsx';
import SectionHeaderRight from '../SectionHeaderRight.jsx';
import FetchService from '../../services/FetchService';
import _ from 'underscore';
import { Link } from 'react-router';
import FieldImageEditContainer from './fields/FieldImageEditContainer.jsx';
import FieldReferenceEditContainer from './fields/FieldReferenceEditContainer.jsx';
import FieldTextAreaEdit from './fields/FieldTextAreaEdit.jsx';

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
        FetchService.get(`api/content/any/${this.props.params.contentId}`).then((contentData) => {
            FetchService.get(`api/content-types/${contentData._contentType}`).then((contentTypeData) => {
                // TODO: Fix these ugly hacks
                // References should be sent to the API using just the id, but the API will return the complete objects.
                // That's why we need to replace the object with just the id. The same with the image, we'd only need
                // the file name instead of the full path
                contentTypeData.fields.forEach(contentType => {
                    if (contentType.type === 'reference') {
                        contentData[contentType.slug] = contentData[contentType.slug]._id;
                    }
                    if (contentType.type === 'image') {
                        if (contentData[contentType.slug]) {
                            contentData[contentType.slug] = _.last(contentData[contentType.slug].split('/'));
                        }
                    }
                });

                _.extend(this.state, { content: contentData });
                _.extend(this.state, { formData: contentData });
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
                                <button className="btn btn-primary">Save</button>
                            </SectionHeaderRight>
                        </SectionHeader>
                        <div className="items-container">
                            <div className="section-body">
                                {
                                    this.state.contentType.fields.map((field) => {
                                        if (field.type === 'text') {
                                            return (
                                                <div key={field.slug}>
                                                    <label htmlFor={field.slug}>{field.name}</label>
                                                    <div className="form-group">
                                                        <input id={field.slug} className="form-control" type="text" onInput={this.onTextFieldInput.bind(this, field.slug)} />
                                                    </div>
                                                </div>
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

    onTextFieldInput(fieldSlug, event) {
        this.setFormValue(fieldSlug, event.target.value);
    }

    setFormValue(key, value) {
        const newFormField = { [key]: value };
        const newFormData = _.extend(this.state.formData, newFormField);
        this.setState(_.extend(this.state, { formData: newFormData }));
    }

}
