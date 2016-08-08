import React from 'react';
import FetchService from '../../services/FetchService';
import ListItem from '../ListItem.jsx';

export default class ReferencePicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = { content: [] };
    }

    componentDidMount() {
        this.getContent(this.props.contentTypes);
    }

    getContent(contentTypes) {
        FetchService.get(`/api/content/${contentTypes[0]}`).then((data) => {
            this.setState({ content: data });
        });
    }

    onSelectReference(item) {
        //this.props.closeImagePicker();
        this.props.changeValue(item._id);
        console.log(item);
    }

    render() {
        let classes = 'dullahan-modal';
        if (this.props.isOpen) {
            classes = 'dullahan-modal is-open';
        }
        return (
            <div className={classes}>
                <div className="section-header">
                    <h1>Select reference</h1>
                    <div className="section-header-right">
                    <button className="btn btn-default" onClick={this.props.closeReferencePicker.bind(this)}>Cancel</button>
                    </div>
                </div>
                <div className="content-create-items-container">
                    {this.state.content.map(item => {
                        return (
                            <div onClick={this.onSelectReference.bind(this, item)} key={item._id}>
                                <ListItem
                                    title={item._title}
                                    image={item._image}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
