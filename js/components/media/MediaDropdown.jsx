import React from 'react';
import FetchService from '../../services/FetchService';

export default class MediaDropdown extends React.Component {

    constructor(props) {
        super(props);
        this.closedState = {style: {display: 'none'}, className: 'media-item-button'};
        this.openState = {style: {display: 'block'}, className: 'media-item-button media-item-button-active'};
        this.state = this.closedState;
    }

    onDropdownToggle() {
        if (this.state.style.display === 'none') {
            this.setState(this.openState);
        } else {
            this.setState(this.closedState);
        }
    }

    onDeleteMedia() {
        this.props.onDelete(this.props.mediaItem.full_name);
    }

    onOpenMedia() {
        window.open(this.props.mediaItem.url);
    }

    onDownloadMedia() {
        window.open(this.props.mediaItem.downloadUrl);
    }

    render(){
        return (
            <div>
            <div className={this.state.className} onClick={this.onDropdownToggle.bind(this)}></div>
            <div className="media-dropdown" style={this.state.style}>
                <div className="media-dropdown-item" onClick={this.onOpenMedia.bind(this)}>Open</div>
                <div className="media-dropdown-item" onClick={this.onDownloadMedia.bind(this)}>Download</div>
                <div className="media-dropdown-item" onClick={this.onDeleteMedia.bind(this)}>Delete</div>
            </div>
            </div>
        )
    }
}
