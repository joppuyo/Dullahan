import 'whatwg-fetch';
import _ from 'underscore';
import __ from 'lodash';

export default class FetchService {
    static get(url, customOptions) {

        const defaultOptions = {
            expandData: true,
        };

        let headers = {
            Accept: 'application/json',
        };

        if (localStorage.getItem('token')) {
            __.assign(headers, { 'X-User-Token': localStorage.getItem('token') });
        }

        const options = __.assign(defaultOptions, customOptions);

        console.log('options', options);

        if (options.expandData === false) {
            __.assign(headers, { 'X-Expand-Data': 'false' });
        }

        console.log(headers);

        return fetch(url, {
            method: 'get',
            headers: headers,
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

    static put(url, data, customOptions) {
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
            method: 'put',
            body: body,
            headers: headers,
        })
            .then(this.handleError);
    }

    static handleError(response) {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }
        return response.json().then((data) => {
            const error = {
                response,
                data,
            };
            throw error;
        });
    }

}
