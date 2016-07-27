import 'whatwg-fetch';
import _ from 'underscore';

export default class FetchService {
    static get(url) {
        return fetch(url, {
            method: 'get',
            headers: {
                Accept: 'application/json',
                'X-User-Token': localStorage.getItem('token'),
            },
        })
            .then(this.handleError)
            .then(response => response.json());
    }
    static post(url, data, customOptions) {
        const defaultOptions = {
            json: true,
        };

        let options = _.extend(defaultOptions, customOptions);

        let body = null;

        if (options.json) {
            body = JSON.stringify(data);
        } else {
            body = data;
        }

        let headers = {
            Accept: 'application/json',
        };

        if (localStorage.getItem('token')) {
            headers['X-User-Token'] = localStorage.getItem('token');
        }

        if (options.json) {
            headers['Content-Type'] = 'application/json';
        }

        return fetch(url, {
            method: 'post',
            headers: headers,
            body: body,
        })
            .then(this.handleError)
            .then(response => response.json());
    }
    static deleteRequest(url) {
        return fetch(url, {
            method: 'delete',
            headers: {
                Accept: 'application/json',
                'X-User-Token': localStorage.getItem('token'),
            },
        })
            .then(this.handleError);
    }

    static handleError(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return response.json().then((error) => {
            throw error;
        });
    }

}
