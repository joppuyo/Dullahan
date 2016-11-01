import React from 'react';
import FieldArrayItem from './FieldArrayItem.jsx';

export default class FieldComponentArray extends React.Component {
    render() {
        return (
            <div className="field field-text">
                <div className="field-name">{this.props.name}</div>
                <div className="field-array-item-container">
                {
                    this.props.items.map((item) => {
                        return (
                            <FieldArrayItem item={item} />
                        );
                    })
                }
                </div>
            </div>
        );
    }
}
