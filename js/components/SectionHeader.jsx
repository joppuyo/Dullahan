import React from 'react';

export default class SectionHeader extends React.Component {
    constructor(props){
        super(props)
    }
    render() {
        return <div className="section-header">
            <h1>{this.props.title}</h1>
            {/* Right side CTA button goes here */}
            { this.props.children }
        </div>
    }
}
