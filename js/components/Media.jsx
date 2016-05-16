import React from 'react';
import { hashHistory, Link } from 'react-router';
import SectionHeader from './SectionHeader.jsx';
import MediaItem from './MediaItem.jsx';
import MediaUploadButton from './MediaUploadButton.jsx';
import DocumentTitle from 'react-document-title';

export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {images: []};
    }
    componentDidMount() {
        fetch('/api/media', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
            }
        }).then(response => {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error;
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                this.setState({images: data});
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