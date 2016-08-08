import React from 'react';
import DocumentTitle from 'react-document-title';
import SectionHeader from '../SectionHeader.jsx';
import SectionHeaderRight from '../SectionHeaderRight.jsx';
import SectionHeaderLeft from '../SectionHeaderLeft.jsx';
import FetchService from '../../services/FetchService';
import _ from 'underscore';
import FieldText from './fields/FieldText.jsx';
import FieldImage from './fields/FieldImage.jsx';
import FieldReference from './fields/FieldReference.jsx';

export default class ContentView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            documentTitle: 'Dullahan',
            contentType: null,
        };
    }

    componentDidMount() {
        FetchService.get(`api/content/any/${this.props.params.contentId}`).then((contentData) => {
            this.setState(_.extend(this.state, { documentTitle: `${contentData._title} - Dullahan` }));
            FetchService.get(`api/content-types/${contentData._contentType}`).then((contentTypeData) => {
                contentTypeData.fields.map(field => {
                    if (contentData[field.slug]) {
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
                                <a href="#" className="btn btn-primary">Edit</a>
                            </SectionHeaderRight>
                        </SectionHeader>
                        <div className="items-container">
                            <div className="section-body">
                                {this.state.contentType.fields.map(field => {
                                    if (field.type === 'text' || field.type === 'textarea') {
                                        return (<FieldText name={field.name} value={field.value} key={field.slug} />);
                                    }
                                    if (field.type === 'image') {
                                        return (<FieldImage name={field.name} url={field.value} key={field.slug} />);
                                    }
                                    if (field.type === 'reference') {
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
