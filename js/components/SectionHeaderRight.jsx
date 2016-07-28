import React from 'react';

export default class SectionHeaderRight extends React.Component {
    render() {
        return (
            <div className="section-header-right">
                {this.props.children}
            </div>
        );
    }
}
