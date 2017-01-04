import FetchService from './services/FetchService';

export function requestContentById(id) {
    return dispatch => {
        FetchService.get(`api/content/all/${id}`, { expandData: false }).then((content) => {
            dispatch({ type: 'RECEIVE_CONTENT_BY_ID', content });
        });
    };
}
