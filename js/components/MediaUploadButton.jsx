import React from 'react';

export default class MediaUploadButton extends React.Component {
    onOpenFileDialog() {
        var input = document.getElementById('media-file-upload');
        input.click();
    }
    onFileSelected() {
        var input = document.getElementById('media-file-upload');
        var data = new FormData;
        var files = input.files;
        if (files) {
            for (var i = 0; i < files.length; i++) {
                data.append(i.toString(),files[i]);
            }
        }
        fetch('/api/media', {
            method: 'POST',
            headers: {
                'X-Access-Token': localStorage.getItem('token')
            },
            body: data,
        })
    }
    render() {
        return <div>
            <input type="file" id="media-file-upload" className="media-file-upload" onChange={this.onFileSelected.bind(this)} multiple/>
            <div className="btn btn-primary media-upload-button" onClick={this.onOpenFileDialog.bind(this)}>Upload media</div>
        </div>
    }
}