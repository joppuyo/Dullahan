import React from 'react';
import { hashHistory, Link } from 'react-router';
import SectionHeader from './SectionHeader.jsx';
import MediaItem from './MediaItem.jsx';
import MediaUploadButton from './MediaUploadButton.jsx';
import DocumentTitle from 'react-document-title';
import FetchService from '../services/FetchService';

export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {images: []};
    }
    componentDidMount() {
        FetchService.get('/api/media').then((data) => {
            this.setState(
                {
                    images: data
                }
            );
        })
    }

    render() {
        return (
        <DocumentTitle title="Media - Dullahan">
            <div className="section-wrapper">
                <SectionHeader title="Media">
                    <MediaUploadButton/>
                </SectionHeader>
                <div className="media-items-container">
                    {this.state.images.map(image => <MediaItem{...image}/>)}
                </div>
            </div>
        </DocumentTitle>
        )
    }
}
