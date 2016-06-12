import React from 'react';

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

    onDeleteImage() {
        console.log('deleting image...' + this.props.image);
        fetch(`/api/media/${this.props.image}`, {
            method: 'DELETE',
            headers: {
                'X-Access-Token': localStorage.getItem('token')
            }
        }).then(() => {
            // Refresh view
        })
    }

    render(){
        return (
            <div>
            <div className={this.state.className} onClick={this.onDropdownToggle.bind(this)}></div>
            <div className="media-dropdown" style={this.state.style}>
                <div className="media-dropdown-item" onClick={this.onDeleteImage.bind(this)}>Delete</div>
            </div>
            </div>
        )
    }
}
