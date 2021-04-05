import Request from './Request';
//import ErrorService from 'lib/services/ErrorService';

// Todo: change body + headers arguments to opts: {} object.
export default class HttpClient {

    // shortcuts
    public get<T>(url, options) {
        return this.request(url, 'GET', null, options.headers);
    }
    public post<T>(url, body, options) {
        return this.request(url, 'POST', body, options.headers);
    }
    public put<T>(url, body, options) {
        return this.request(url, 'PUT', body, options.headers);
    }
    public delete<T>(url, options) {
        return this.request(url, 'DELETE', null, options.headers);
    }

    // underlying Request wrapper
    private async request(url: string, method: string = 'GET', body: any = undefined, headers = undefined): Promise<any> {
        return new Promise((resolve, reject) => {
            let request;

            switch (method.toLowerCase()) {
                case 'get':
                    request = Request.get(url, headers);
                    break;
                case 'post':
                    request = Request.post(url, body, headers);
                    break;
                case 'put':
                    request = Request.put(url, body, headers);
                    break;
                case 'delete':
                    request = Request.delete(url, headers);
                    break;
                default:
                    request = Request.get(url, headers);
                    break;
            }

            request
                .then(r => {
                    // first see if an error was thrown
                    if (!r.ok) {
                        console.log('bad response')
                        let handled = false;// ErrorService.handleError(r);
                        if (!handled) {
                            return reject(r);
                        } else {
                            return resolve(false);
                        }
                    }
                    return r.text()
                })
                .then(text => {
                    return text ? JSON.parse(text) : {};
                })
                .then(r => {
                    return resolve(r);
                })
                .catch(e => {
                    console.log('REQUEST ERROR', e)
                    return reject("Failed to make request.");
                });
        });

    }

}