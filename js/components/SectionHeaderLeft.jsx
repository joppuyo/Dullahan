import React from 'react';

export default class SectionHeaderLeft extends React.Component {
    render() {
        return (
            <div className="section-header-left">
                {this.props.children}
            </div>
        );
    }
}
