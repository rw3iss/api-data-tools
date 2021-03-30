import HttpClient from './HttpClient';

/* todo: 
    support extensions that can register their own routes, ie. an Auth exension
    client.authExt.login(user, pass) // returns something...
*/

export default class APIClient extends HttpClient {

    constructor(apiBase) {
        super();
        if (!apiBase)
            throw "APIClient requires the base URI of the API as an argument.";
        // todo: load extensions from config...
        console.log('APIClient initialized with:', apiBase);
        this.apiBase = apiBase;
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
            let url = `${this.apiBase}/${type}${limit ? ('?limit='+limit) : ''}`;
            return await super.get(url);
        } catch(e) {
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
            console.log('getone response', r)
            return r.length ? r[0] : null;
        } catch(e) {
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
            if (o.id) url += `/${o.id}`;
            return await this.post(url, o);
        } catch(e) {
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
            if (!params.id) throw "delete requires an id parameter";
            let url = `${this.apiBase}/${type}/${params.id}`;
            return await this.delete(url);
        } catch(e) {
            debug('Client.delete error', e);
            throw e;
        }
    }

}