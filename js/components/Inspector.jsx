import React from 'react';

export default class Inspector extends React.Component {

    render() {

        let contentType = 'Author';

        return (
            <div className="inspector-wrapper">
                <div className="inspector-background-fade" onClick={this.props.closeInspector} />
                <div className="inspector">
                    <h1 className="inspector-title">View {contentType}</h1>
                    <p>{JSON.stringify(this.props.data)}</p>
                    <button className="btn btn-primary" onClick={this.props.closeInspector}>Close</button>
                </div>
            </div>
        );
    }
}
