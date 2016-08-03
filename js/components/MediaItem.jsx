import React from 'react';
import MediaDropdown from './MediaDropdown.jsx';

export default class MediaItem extends React.Component {
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
                <div className="media-item-inner">
                    <div className="media-item-image" style={style} />
                    <div className="media-item-lower">
                        <div className="media-item-name">{this.props.filename}</div>
                        <div className="media-item-meta">{this.props.extension} - 2012-12-12 12:32</div>
                        <MediaDropdown onDelete={this.props.onDelete} mediaItem={this.props}/>
                    </div>
                </div>
            </div>
        )
    }
}
