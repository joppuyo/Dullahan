import 'whatwg-fetch';
import _ from 'underscore';

export default class FetchService {
    static get(url){
        return fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'X-User-Token': localStorage.getItem('token'),
            }
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(response => response.json())
            .then(data => {
                return data;
            })
    }
    static post(url, data, customOptions) {

        var defaultOptions = {
            json: true,
        };

        var options = _.extend(defaultOptions, customOptions);

        var body = null;

        if (options.json) {
            body = JSON.stringify(data);
        } else {
            body = data;
        }

        var headers = {
            'Accept': 'application/json',
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
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(response => response.json())
            .then(data => {
                return data;
            })
    }
    static deleteRequest(url) {
        return fetch(url, {
            method: 'delete',
            headers: {
                'Accept': 'application/json',
                'X-User-Token': localStorage.getItem('token'),
            }
        })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    return response;
                } else {
                    var error = new Error(response.statusText);
                    error.response = response;
                    throw error;
                }
            })
            .then(response => response.json())
            .then(data => {
                return data;
            })
    }
}
