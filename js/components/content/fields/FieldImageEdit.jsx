import React from 'react';
import FetchService from '../../../services/FetchService';
import ImagePicker from '../ImagePicker.jsx';
import _ from 'underscore';

export default class FieldImageEdit extends React.Component {

    render() {
        return (
            <div className="field-edit-upload-button" style={{ backgroundImage: `url(${this.props.imageUrl})` }} />
        );
    }

}
