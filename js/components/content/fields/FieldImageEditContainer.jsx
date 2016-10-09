import React from 'react';
import FetchService from '../../../services/FetchService';
import ImagePicker from '../ImagePicker.jsx';
import FieldImageEdit from './FieldImageEdit.jsx';
import _ from 'underscore';

export default class FieldImageEditContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = { modalOpen: false, value: null, selected: false };
    }

    fetchImage(value) {
        FetchService.get('api/media').then((response) => {
            // TODO: endpoint to get single image
            response.forEach((image) => {
                if (image.full_name === value) {
                    this.setState(
                        _.extend(this.state, { selected: true, data: image })
                    );
                }
            });
        });
    }

    changeValue(value){
        this.setState(_.extend(this.state, { image: value }));
        this.props.setFormValue(this.props.field.slug, value);
        this.fetchImage(value);
    }

    componentDidMount() {
        console.log('Image field mounted');
        if (_.has(this.props.formData, this.props.field.slug)) {
            this.fetchImage(this.props.formData[this.props.field.slug]);
        }
    }

    render() {
        return (
            <div key={this.props.field.slug} className="form-group">
                <label>{this.props.field.name}</label>
                {(() => {
                    if (this.state.selected) {
                        return (
                            <FieldImageEdit imageUrl={this.state.data.thumbnail} />
                        );
                    }
                    return (
                        <div>
                            <ImagePicker isOpen={this.state.modalOpen} changeValue={this.changeValue.bind(this)} closeImagePicker={this.closeImagePicker.bind(this)} />
                            <div onClick={this.openImagePicker.bind(this)}>Select image...</div>
                        </div>
                    );
                })()}
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
