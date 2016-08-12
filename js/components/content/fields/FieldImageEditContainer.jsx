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

    changeValue(value){
        this.setState(_.extend(this.state, { image: value }));
        this.props.setFormValue(this.props.field.slug, value);
    }

    updateField() {
        if (_.has(this.props.formData, this.props.field.slug)) {
            const value = this.props.formData[this.props.field.slug];

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
    }

    componentDidMount() {
        console.log('Image field mounted');
        this.updateField();
    }

    componentWillReceiveProps() {
        console.log('Image field updated');
        this.updateField();
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
