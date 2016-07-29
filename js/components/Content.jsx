import React from 'react';
import SectionHeader from './SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import SectionHeaderLeft from './SectionHeaderLeft.jsx';
import SectionHeaderRight from './SectionHeaderRight.jsx';
import FetchService from '../services/FetchService';
import _ from 'underscore';
import ListItem from './ListItem.jsx';

export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentTypes: [],
            content: [],
        };
    }

    componentDidMount() {
        FetchService.get('api/content').then((data) => {
            this.setState(_.extend(this.state, { contentTypes: data }));

            // Get the initial data
            if (data && data[0]) {
                this.getContent(data[0].slug);
            }
        });
    }

    onContentTypeSelect(event) {
        let contentTypeSlug = event.target.value;
        this.getContent(contentTypeSlug);
    }

    getContent(contentTypeSlug) {
        FetchService.get(`api/content/${contentTypeSlug}`).then((data) => {
            this.setState(_.extend(this.state, { content: data }));
        });
    }

    render() {
        return (
            <DocumentTitle title="Content - Dullahan">
                <div className="section-wrapper">
                    <SectionHeader title="Content">
                        <SectionHeaderLeft>
                            <label>
                                <div className="custom-select content-type-selector">
                                    <select onChange={this.onContentTypeSelect.bind(this)}>
                                        {this.state.contentTypes.map((contentType) => <option value={contentType.slug} key={contentType.slug}>{contentType.name}</option>)});}
                                    </select>
                                </div>
                            </label>
                        </SectionHeaderLeft>
                        <SectionHeaderRight>
                            <a href="#" className="btn btn-primary">Add new content</a>
                        </SectionHeaderRight>
                    </SectionHeader>
                    {this.state.content.map(item =>
                        <ListItem
                            title={item._title}
                            subtitle="Subtitle"
                            key={item._id}
                            image={item._image}
                        />
                    )}
                </div>
            </DocumentTitle>
        );
    }
}
