import _ from 'lodash';

const DEFAULT_STATE = {
    inspector: {
        isOpen: false,
    },
    currentlyEditedContentType: null,
};

export default function reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case 'OPEN_INSPECTOR':
            console.log('opening inspector');
            return _.assign({}, state, { inspector: { isOpen: true, data: action.data } });
        case 'CLOSE_INSPECTOR':
            console.log('closing inspector');
            return _.assign({}, state, { inspector: { isOpen: false } });
        case 'REQUEST_CONTENT_BY_ID':
            console.log('requesting content by id ' + action.id);
            return state;
        case 'RECEIVE_CONTENT_BY_ID':
            return _.assign({}, state, { currentlyEditedContentType: action.content });
    }
    return state;
}
