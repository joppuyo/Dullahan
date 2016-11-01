import React from 'react';
import FieldReferenceItem from './FieldReferenceItem.jsx';

export default class FieldReferenceArray extends React.Component {
    render() {
        return (
            <div className="field field-text">
                <div className="field-name">{this.props.name}</div>
                {
                    this.props.items.map((item) => {
                        return (
                            <FieldReferenceItem
                                image={item._image}
                                title={item._title}
                                subtitle={item._contentType}
                            />
                        );
                    })
                }
            </div>
        );
    }
}
