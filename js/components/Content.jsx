import React from 'react';
import SectionHeader from './SectionHeader.jsx';
import DocumentTitle from 'react-document-title';
import SectionHeaderLeft from './SectionHeaderLeft.jsx';
import SectionHeaderRight from './SectionHeaderRight.jsx';
import FetchService from '../services/FetchService';
import _ from 'underscore';

export default class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contentTypes: [],
        };
    }

    componentDidMount() {
        FetchService.get('api/content').then((data) => {
            this.setState(_.extend(this.state, { contentTypes: data }));
        });
    }

    render() {
        return (
            <DocumentTitle title="Content - Dullahan">
                <SectionHeader title="Content">
                    <SectionHeaderLeft>
                        <label>
                            <div className="custom-select content-type-selector">
                                <select>
                                    {this.state.contentTypes.map((contentType) => <option value={contentType.slug}>{contentType.name}</option>)});}
                                </select>
                            </div>
                        </label>
                    </SectionHeaderLeft>
                    <SectionHeaderRight>
                        <a href="#" className="btn btn-primary">Add new content</a>
                    </SectionHeaderRight>
                </SectionHeader>
            </DocumentTitle>
        )
    }
}
