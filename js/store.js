import { createStore, applyMiddleware, compose } from 'redux';
import reducer from './reducer';

import thunkMiddleware from 'redux-thunk';

let preloadedState;

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    preloadedState = compose(applyMiddleware(thunkMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__());
} else {
    preloadedState = compose(applyMiddleware(thunkMiddleware));
}

const store = createStore(reducer, preloadedState);
export default store;
