import React from 'react';
import MediaDropdown from './MediaDropdown.jsx';

export default class MediaItem extends React.Component {
    render() {
        return (
            <div className="media-item-outer">
                <div className="media-item-inner">
                    <div className="media-item-image" style={{backgroundImage: 'url(' + this.props.thumbnail + ')'}}></div>
                    <div className="media-item-lower">
                        <div className="media-item-name">{this.props.filename}</div>
                        <div className="media-item-meta">{this.props.extension} - 2012-12-12 12:32</div>
                        <MediaDropdown image={this.props.full_name}></MediaDropdown>
                    </div>
                </div>
            </div>
        )
    }
}
