import React from 'react';

export default class FieldReferenceItem extends React.Component {
    render() {
        let backgroundImage = 'assets/icons/icon-content-placeholder.svg';
        if (this.props.image) {
            backgroundImage = this.props.image;
        }
        const backgroundStyle = { backgroundImage: `url(${backgroundImage})` };
        return (
            <div className="field field-reference-value clearfix">
                <div className="field-reference-value-image" style={backgroundStyle} />
                <div className="field-reference-value-text">
                    <div className="field-reference-value-text-title">{this.props.title}</div>
                    <div className="field-reference-value-text-subtitle">{this.props.subtitle}</div>
                </div>
            </div>
        );
    }
}

FieldReferenceItem.propTypes = {
    title: React.PropTypes.string,
    subtitle: React.PropTypes.string,
    image: React.PropTypes.string,
};

