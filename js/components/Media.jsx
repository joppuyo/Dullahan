import React from 'react';
import { hashHistory, Link } from 'react-router';
import SectionHeader from './SectionHeader.jsx';
import MediaItem from './MediaItem.jsx';
import MediaUploadButton from './MediaUploadButton.jsx';
import DocumentTitle from 'react-document-title';
import FetchService from '../services/FetchService';
import SectionHeaderRight from './SectionHeaderRight.jsx';

export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {images: []};
    }

    componentDidMount() {
        this.getMedia();
    }

    handleUpload(data) {
        FetchService.post('api/media', data, {json: false}).then(() => {
            this.getMedia();
        });
    }

    getMedia() {
        FetchService.get('/api/media').then((data) => {
            this.setState(
                {
                    images: data
                }
            );
        })
    }

    handleDelete(filename) {
        FetchService.deleteRequest(`/api/media/${filename}`)
            .then((data) => {
                this.getMedia();
            })
    }

    render() {
        return (
        <DocumentTitle title="Media - Dullahan">
            <div className="section-wrapper">
                <SectionHeader title="Media">
                    <SectionHeaderRight>
                        <MediaUploadButton onUpload={this.handleUpload.bind(this)}/>
                    </SectionHeaderRight>
                </SectionHeader>
                <div className="media-items-container">
                    {this.state.images.map(image => <MediaItem {...image} key={image.filename} onDelete={this.handleDelete.bind(this)}/>)}
                </div>
            </div>
        </DocumentTitle>
        )
    }
}
