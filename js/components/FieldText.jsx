import React from 'react';

export default class FieldText extends React.Component {
    render() {
        return (
            <div className="field-text-item">
                <div className="field-text-key">{this.props.name}</div>
                {(() => {
                    if (this.props.value) {
                        return <div className="field-text-value">{this.props.value}</div>;
                    }
                    return <div className="field-text-value field-text-value-null">No value</div>;
                })()}
            </div>
        );
    }
}
