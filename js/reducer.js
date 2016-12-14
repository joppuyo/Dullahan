import _ from 'lodash';

const DEFAULT_STATE = {
    inspector: {
        isOpen: false,
    },
};

export default function reducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case 'OPEN_INSPECTOR':
            console.log('opening inspector');

            return _.assign({}, state, { inspector: { isOpen: true, data: action.data } });
        case 'CLOSE_INSPECTOR':
            console.log('closing inspector');
            return _.assign({}, state, { inspector: { isOpen: false } });
    }
    return state;
}
