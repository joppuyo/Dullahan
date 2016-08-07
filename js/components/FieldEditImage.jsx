import React from 'react';
import FetchService from '../services/FetchService';
import ImagePicker from './ImagePicker.jsx';
import _ from 'underscore';

export default class FieldEditImage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { modalOpen: false, value: null };
    }

    changeValue2(value){
        this.setState(_.extend(this.state, { image: value }));
        this.props.setFormValue(this.props.field.slug, value);

        FetchService.get('api/media').then((response) => {
            // TODO: endpoint to get single image
            response.forEach((image) => {
                if (image.full_name === this.state.image) {
                    this.setState(_.extend(this.state, { imageUrl: image.thumbnail }));
                }
            });
        });
    }

    render() {
        return (
            <div key={this.props.field.slug}>
                <label htmlFor={this.props.field.slug}>{this.props.field.name}</label>
                <div onClick={this.openImagePicker.bind(this)}
                     className="field-edit-upload-button"
                     style={{ backgroundImage: `url(${this.state.imageUrl})` }}
                />
                <div className="form-group">
                    <ImagePicker isOpen={this.state.modalOpen} changeValue2={this.changeValue2.bind(this)} closeImagePicker={this.closeImagePicker.bind(this)} />
                </div>
            </div>
        );
    }

    openImagePicker() {
        this.setState(_.extend(this.state, { modalOpen: true }));
    }

    closeImagePicker() {
        this.setState(_.extend(this.state, { modalOpen: false }));
    }
}
