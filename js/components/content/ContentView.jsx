import React from 'react';
import { Link } from 'react-router';
import DocumentTitle from 'react-document-title';
import SectionHeader from '../SectionHeader.jsx';
import SectionHeaderRight from '../SectionHeaderRight.jsx';
import SectionHeaderLeft from '../SectionHeaderLeft.jsx';
import FetchService from '../../services/FetchService';
import _ from 'underscore';
import FieldText from './fields/FieldText.jsx';
import FieldBoolean from './fields/FieldBoolean.jsx';
import FieldMarkdown from './fields/FieldMarkdown.jsx';
import FieldImage from './fields/FieldImage.jsx';
import FieldReference from './fields/FieldReference.jsx';
import FieldEmpty from './fields/FieldEmpty.jsx';
import FieldArray from './fields/FieldArray.jsx';
import __ from 'lodash';

export default class ContentView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            documentTitle: 'Dullahan',
            contentType: null,
        };
    }

    componentDidMount() {
        FetchService.get(`api/content/all/${this.props.params.contentId}`).then((contentData) => {
            _.extend(this.state, { content: contentData });
            this.setState(_.extend(this.state, { documentTitle: `${this.state.content._title} - Dullahan` }));
            FetchService.get(`api/content-types/${contentData._contentType}`).then((contentTypeData) => {
                contentTypeData.fields.map(field => {
                    if (__.has(contentData, field.slug)) {
                        field.value = contentData[field.slug];
                    }
                    return field;
                });
                this.setState(_.extend(this.state, { contentType: contentTypeData }));
            });
        });
    }

    render() {
        if (this.state.contentType) {
            return (
                <DocumentTitle title={this.state.documentTitle}>
                    <div className="section-wrapper">
                        <SectionHeader title={`View ${this.state.contentType.name}`}>
                            <SectionHeaderRight>
                                <a href="#" className="btn btn-danger">Delete</a>
                                <Link to={`content/${this.state.content._id}/edit`} className="btn btn-primary">Edit</Link>
                            </SectionHeaderRight>
                        </SectionHeader>
                        <div className="items-container">
                            <div className="section-body">
                                {this.state.contentType.fields.map(field => {
                                    if (field.type === 'text' || field.type === 'textarea') {
                                        if (field.value) {
                                            return (<FieldText name={field.name} value={field.value} key={field.slug} />);
                                        }
                                        return (<FieldEmpty name={field.name} key={field.slug} />);
                                    }
                                    if (field.type === 'boolean') {
                                        if (field.value !== null) {
                                            return (<FieldBoolean name={field.name} value={field.value} key={field.slug} />);
                                        }
                                        return (<FieldEmpty name={field.name} key={field.slug} />);
                                    }
                                    if (field.type === 'markdown') {
                                        if (field.value) {
                                            return (<FieldMarkdown name={field.name} value={field.value} key={field.slug} />);
                                        }
                                        return (<FieldEmpty name={field.name} key={field.slug} />);
                                    }
                                    if (field.type === 'image') {
                                        if (field.value) {
                                            return (<FieldImage name={field.name} url={field.value} key={field.slug} />);
                                        }
                                        return (<FieldEmpty name={field.name} key={field.slug} />);
                                    }
                                    if (field.type === 'reference') {
                                        if (field.value) {
                                            return (
                                                <FieldReference
                                                    name={field.name}
                                                    title={field.value._title}
                                                    subtitle={field.value._contentType}
                                                    image={field.value._image}
                                                    key={field.slug}
                                                />
                                            );
                                        }
                                        return (<FieldEmpty name={field.name} key={field.slug} />);
                                    }
                                    if (field.type === 'array') {
                                        if (field.value && !__.isEmpty(field.value)) {
                                            return (
                                                <FieldArray
                                                    name={field.name}
                                                    items={field.value}
                                                />
                                            );
                                        }
                                        return (<FieldEmpty name={field.name} key={field.slug} />);
                                    }
                                    return false;
                                })}
                            </div>
                        </div>
                    </div>
                </DocumentTitle>
            );
        }
        return null;
    }
}
