import React from 'react';

export default class SectionHeader extends React.Component {
    constructor(props){
        super(props)
    }
    render(props) {
        return <div className="section-header">
            <h1>{this.props.title}</h1>
        </div>
    }
}