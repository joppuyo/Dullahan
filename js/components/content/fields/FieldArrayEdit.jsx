import React from 'react';
import FieldArrayItem from './FieldArrayItem.jsx';
import __ from 'underscore';

export default class FieldArray extends React.Component {
    render() {
        let value = null;
        if (__.has(this.props.formData, this.props.field.slug)) {
            value = this.props.formData[this.props.field.slug];
        }

        return (
            <div >
                <label>{this.props.field.name}</label>
                <div className="field-array-item-container">
                    {
                        value.map((item) => {
                            return (
                                <FieldArrayItem item={item} />
                            );
                        })
                    }
                </div>
            </div>
        )
    }
}
