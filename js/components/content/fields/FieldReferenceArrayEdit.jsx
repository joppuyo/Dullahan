import React from 'react';
import FieldArrayItem from './FieldArrayItem.jsx';
import FieldReferenceItem from './FieldReferenceItem.jsx';
import __ from 'underscore';
import FetchService from '../../../services/FetchService';

export default class FieldArray extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: [] };
    }
    componentDidMount() {
        if (__.has(this.props.formData, this.props.field.slug)) {
            const value = this.props.formData[this.props.field.slug];
            const promises = value.map((id) => {
                return FetchService.get(`api/content/all/${id}`);
            });
            Promise.all(promises).then((response) => {
                this.setState({ value: response });
            });
        }
    }
    render() {
        return (
            <div className="field">
                <label>{this.props.field.name}</label>
                    {
                        this.state.value.map((item) => {
                            return (
                                <FieldReferenceItem
                                    image={item._image}
                                    title={item._title}
                                    subtitle={item._contentType}
                                />
                            );
                        })
                    }
                <div className="field-reference-value clearfix">
                    <div className="field-reference-value-image field-reference-value-image-add" />
                    <div className="field-reference-value-text">
                        <div className="field-reference-value-text-title field-reference-value-text-title-no-subtitle">Add reference</div>
                    </div>
                </div>
            </div>
        )
    }
}
