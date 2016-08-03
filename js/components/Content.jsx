import React from 'react';
import SectionHeader from './SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import SectionHeaderLeft from './SectionHeaderLeft.jsx';
import SectionHeaderRight from './SectionHeaderRight.jsx';
import FetchService from '../services/FetchService';
import _ from 'underscore';
import ListItem from './ListItem.jsx';
import { Link } from 'react-router';

export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentTypes: [],
            content: [],
            currentContentType: null,
        };
    }

    componentDidMount() {
        FetchService.get('api/content').then((data) => {
            this.setState(_.extend(this.state, { contentTypes: data }));

            // Get the initial data
            if (data && data[0]) {
                this.setContentType(data[0].slug);
            }
        });
    }

    onContentTypeSelect(event) {
        let contentTypeSlug = event.target.value;
        this.setContentType(contentTypeSlug);
    }

    setContentType(contentTypeSlug) {
        FetchService.get(`api/content/${contentTypeSlug}`).then((data) => {
            this.setState(_.extend(this.state, { content: data }));
            let contentType = _.findWhere(this.state.contentTypes, { slug: contentTypeSlug });
            this.setState(_.extend(this.state, { currentContentType: contentType }));
        });
    }

    render() {
        if (this.state.currentContentType) {
            return (
                <DocumentTitle title="Content - Dullahan">
                    <div className="section-wrapper">
                        <SectionHeader title="Content">
                            <SectionHeaderLeft>
                                <label>
                                    <div className="custom-select content-type-selector">
                                        <select onChange={this.onContentTypeSelect.bind(this)}>
                                            {this.state.contentTypes.map((contentType) => {
                                                return (
                                                    <option value={contentType.slug}  key={contentType.slug}>{contentType.name}</option>
                                                );
                                            })
                                            }
                                        </select>
                                    </div>
                                </label>
                            </SectionHeaderLeft>
                            <SectionHeaderRight>
                                <Link to={`content/create/${this.state.currentContentType.slug}`}
                                      className="btn btn-primary">Add new {this.state.currentContentType.name}</Link>
                            </SectionHeaderRight>
                        </SectionHeader>
                        {this.state.content.map(item =>
                            <ListItem
                                link={`content/${item._id}`}
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
        return null;
    }
}
