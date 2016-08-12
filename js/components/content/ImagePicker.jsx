import React from 'react';
import FetchService from '../../services/FetchService';
import MediaItemSelect from './MediaItemSelect.jsx';

export default class ImagePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { images: [] };
    }

    componentDidMount() {
        this.getMedia();
    }

    getMedia() {
        FetchService.get('/api/media').then((data) => {
            this.setState({ images: data });
        });
    }

    onSelectImage(imageName) {
        this.props.closeImagePicker();
        this.props.changeValue(imageName);
    }

    render() {
        let classes = 'dullahan-modal';
        if (this.props.isOpen) {
            classes = 'dullahan-modal is-open';
        }
        return (
            <div className={classes}>
                <div className="section-wrapper">
                    <div className="section-header">
                        <h1>Select image</h1>
                        <div className="section-header-right">
                            <button className="btn btn-default" onClick={this.props.closeImagePicker.bind(this)}>Cancel</button>
                        </div>
                    </div>
                    <div className="media-items-container">
                        {this.state.images.map(image => <MediaItemSelect onSelectImage={this.onSelectImage.bind(this)} {...image} key={image.full_name}/>)}
                    </div>
                </div>
            </div>
        );
    }
}
