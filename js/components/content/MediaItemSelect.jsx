import React from 'react';

export default class MediaItemSelect extends React.Component {
    render() {
        let style = {
            backgroundImage: 'url("assets/icons/icon-media-file.svg")',
            backgroundSize: 'auto',
            backgroundColor: '#DFDFDF',
        };
        if (this.props.thumbnail) {
            style = { backgroundImage: `url(${this.props.thumbnail})` };
        }
        return (
            <div className="media-item-outer">
                <div className="media-item-inner" onClick={this.props.onSelectImage.bind(this, this.props.full_name)}>
                    <div className="media-item-image" style={style} />
                    <div className="media-item-lower">
                        <div className="media-item-name">{this.props.filename}</div>
                        <div className="media-item-meta">{this.props.extension} - 2012-12-12 12:32</div>
                    </div>
                </div>
            </div>
        )
    }
}
