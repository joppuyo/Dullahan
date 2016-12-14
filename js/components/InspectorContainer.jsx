import React from 'react';
import Inspector from './Inspector.jsx';
import { connect } from 'react-redux';

class InspectorContainer extends React.Component {
    closeInspector() {

    }
    render() {
        if (this.props.isOpen) {
            return (
                <Inspector closeInspector={this.props.closeInspector} isOpen={this.props.isOpen} data={this.props.data} />
            );
        }
        return null;
    }
}

const mapDispatchToProps = function(dispatch) {
    return {
        closeInspector: () => {
            dispatch({ type: 'CLOSE_INSPECTOR'});
        }
    }
}

const mapStateToProps = function(store) {
    console.log('STORE', store);
    return {
        isOpen: store.inspector.isOpen,
        data: store.inspector.data,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(InspectorContainer);
