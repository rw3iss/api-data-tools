import HttpClient from './HttpClient';

/* todo: 
    support extensions that can register their own routes, ie. an Auth exension
    client.authExt.login(user, pass) // returns something...
*/

export default class APIClient extends HttpClient {

    apiBase;
    options;

    constructor(apiBase, options?) {
        super();
        if (!apiBase)
            throw "APIClient requires the base URI of the API as an argument.";
        // todo: load extensions from config...
        this.apiBase = apiBase;
        this.options = options;
    }

    /**
     * @description Get an instance of the given type, according to parameters.
     * @param {string} type
     * @param {*} [params]      
     * @param {*} [limit]
     * @return {$type} Set of matching objects.
     */
    get = async (type: string, params?, limit?) => {
        try {
            let url = `${this.apiBase}/${type}${limit ? ('?limit=' + limit) : ''}`;
            console.log('get', this.options)
            return await super.get(url, this.options);
        } catch (e) {
            console.log('Client.get error', e)
            throw e;
        }
    }

    /**
     * @description Gsets the first instance of returned set, or null if none found.
     * @param {string} type
     * @param {object} [params]
     * @param {boolean} [serialize=false]
     * @return {$type | null} The first result, or null if none found.
     */
    async getOne(type: string, params?: object, serialize: boolean = false) {
        console.log('getone')
        try {
            let r = await this.get(type, params, 1);
            return r.length ? r[0] : null;
        } catch (e) {
            console.log('Client.getOne error', e)
            throw e;
        }
    }

    /**
     * @description Updates an object if it exists, or otherwise inserts a new one.
     * @param {string} type
     * @param {object} o
     * @return {$type} Returns the new or updated object.
     */
    save = async (type: string, o: object) => {
        console.log('save')
        try {
            let url = `${this.apiBase}/${type}`;
            if (o.id) {
                url += `/${o.id}`;
                return await super.put(url, o, this.options);
            } else {
                return await super.post(url, o, this.options);
            }
        } catch (e) {
            console.log('Client.save error', e)
            throw e;
        }
    }

    /** 
     * @description Deletes the object matching the parameters.
     * @param {string} type
     * @param {object} params
     * @return {*} The delete result.
     */
    delete = async (type: string, params) => {
        try {
            console.log('delete >', type, params)
            if (typeof params.id == 'undefined') throw "delete requires an id parameter";
            let url = `${this.apiBase}/${type}/${params.id}`;
            console.log('calling delete...', this.options)
            return await super.delete(url, this.options);
        } catch (e) {
            console.log('Client.delete error', e);
            throw e;
        }
    }

}