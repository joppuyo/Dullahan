import React from 'react';
import DocumentTitle from 'react-document-title';
import SectionHeader from './SectionHeader.jsx';
import SectionHeaderRight from './SectionHeaderRight.jsx';
import SectionHeaderLeft from './SectionHeaderLeft.jsx';
import FetchService from '../services/FetchService';
import _ from 'underscore';
import FieldText from './FieldText.jsx'

export default class ContentView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            documentTitle: 'Dullahan',
            fields: [],
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
                this.setState(_.extend(this.state, { fields: contentTypeData.fields }));
                console.log(this.state);
            });
        });
    }

    render() {
        return (
            <DocumentTitle title={this.state.documentTitle}>
                <div className="section-wrapper">
                    <SectionHeader title="View Content">
                        <SectionHeaderRight>
                            <a href="#" className="btn btn-danger">Delete</a>
                            <a href="#" className="btn btn-primary">Edit</a>
                        </SectionHeaderRight>
                    </SectionHeader>
                    <div className="section-body">
                        {this.state.fields.map(field => {
                            if (field.type === 'text' || field.type === 'textarea') {
                                return (<FieldText name={field.name} value={field.value} />);
                            }
                            return false;
                        })}
                    </div>
                </div>
            </DocumentTitle>
        );
    }
}
