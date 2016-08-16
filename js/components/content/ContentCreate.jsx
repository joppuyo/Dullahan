import React from 'react';

import DocumentTitle from 'react-document-title';
import SectionHeader from '../SectionHeader.jsx';
import SectionHeaderRight from '../SectionHeaderRight.jsx';
import FetchService from '../../services/FetchService';
import _ from 'underscore';
import { hashHistory } from 'react-router';
import MediaItemSelect from './MediaItemSelect.jsx';
import FieldImageEditContainer from './fields/FieldImageEditContainer.jsx';
import FieldReferenceEditContainer from './fields/FieldReferenceEditContainer.jsx';
import FieldTextAreaEdit from './fields/FieldTextAreaEdit.jsx';
import FieldTextEdit from './fields/FieldTextEdit.jsx';

export default class ContentCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentType: null,
            formData: {},
        };
    }

    componentDidMount() {
        FetchService.get(`api/content-types/${this.props.params.contentTypeSlug}`).then((contentTypeData) => {
            this.setState(_.extend(this.state, { contentType: contentTypeData }));
        });
    }

    render() {
        if (this.state.contentType) {
            return (
                <DocumentTitle title={`Add new ${this.state.contentType.name} - Dullahan`}>
                    <div className="section-wrapper">
                        <SectionHeader title={`Add new ${this.state.contentType.name}`}>
                            <SectionHeaderRight>
                                <button className="btn btn-default">Cancel</button>
                                <button onClick={this.publishContent.bind(this)} className="btn btn-primary">Save</button>
                                <button className="btn btn-primary">Publish</button>
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

    publishContent() {
        FetchService.post(`api/content/${this.state.contentType.slug}`, this.state.formData).then((response) => {
            hashHistory.push('/content');
        }).catch((error) => {
            // TODO: error handling
            alert('Error adding content');
        });
    }
}
