
import DataMapper from './DataMapper';
import SchemaHelper from './SchemaHelper';
import RouteHelper from './RouteHelper';
import Response from '../utils/Response';
import { debug } from '../utils/utils';
import Config from './Config';

let schema = SchemaHelper.getSchema();

/* TODO:


validateTypeRequest should parse body only for put post and patch.

each handler should validate param


*/



/**
 * @description These are default CRUD endpoint handlers that the REST API utilizes based on the JSON schema. 
 * This class utilizes the DataMapper to execute the CRUD operations.
 */
export default class ResourceHandler {
    
    /**
     * @description Generic resource GET handler.
     * @static
     */
    static async get(req, res, ctx?) {
        debug('ResourceHandler.get', req.url, typeof res, ctx);
        let type = _validateTypeRequest(req, ctx);
        let d = await DataMapper.get(type, ctx);
        Response.success(res, d);
    }

    /**
     * @description Generic resource PUT handler.
     * @static
     */
    static async put(req, res, ctx?) {
        let body: any = await parseBody(req);
        debug('ResourceHandler.put', req.url, ctx, body);
        let type = _validateTypeRequest(req, ctx, body);
        let d = await DataMapper.save(type, body);  
        Response.success(res, d);
    }

    /**
     * @description Generic resource POST handler.
     * @static
     */
    static async post(req, res, ctx?) {
        try {
            let body: any = await parseBody(req);
            debug('ResourceHandler.post', req.url, ctx, body);
            let type = _validateTypeRequest(req, ctx, body);
            let d = await DataMapper.save(type, body);
            Response.success(res, d);
        } catch(e) {
            console.log("Error parsing post request body:", e);
            Response.error(res, 'Error parsing req body JSON');
        }
    }

    /**
     * @description Generic resource PATCH handler.
     * @static
     */
    static async patch(req, res, ctx?) {
        let body: any = await parseBody(req);
        debug('ResourceHandler.;patch', req.url, ctx, body);
        let type = _validateTypeRequest(req, ctx, body);
        let d = await DataMapper.save(type, body);  
        res.end(JSON.stringify({ success: true, data: d }));
    }

    /**
     * @description Generic resource DELETE handler.
     * @static
     */
    static async delete(req, res, ctx?) {
        debug('ResourceHandler.delete', req.url, ctx);
        let type = _validateTypeRequest(req, ctx);
        let d = await DataMapper.delete(type, ctx);
        res.end(JSON.stringify({ success: true, data: d }));
    }
}

// HELPERS ///////////////////////////////////////

/**
 * @description
 * @param {*} req The request object.
 * @return {string} The valid type string.
 * @throws Invalid type error.
 */
const _validateTypeRequest = (req: object, ctx, body?: object): string => {
    let type = _findTypeFromUrl(req.url);
    if (!type) throw "Type not inferred from request: " + req.url;
    if (body && Config.validateApiParams) {
        if(!_isValidTypeRequest(type, body)) {
            // Todo: probably move this from basic validation to extensive validation.
            throw "Invalid request for type: " + type;
        }
    }
    return type;
}

/**
 * @description Gets inferred type from first path segment of request url.
 * @param {string} url The request url
 * @return {string} The first path segment/schema type. 
 */
function _findTypeFromUrl(url) {
    let apiPrefix = RouteHelper.getApiPrefix();
    url = url.replace(apiPrefix, '');
    let type = url.match(/\/?([a-zA-Z0-9]{0,})\/?/); 
    return type.length > 0 ? type[1] : '';
}

/**
 * @description Validates that the type exists and, if given, the params are valid according to the type's schema
 * @param {string} type - the schema type
 * @param {object} [params] The parameters of the request.
 * @param {string} [method] The HTTP method.
 * @return {boolean}
 * TODO: take into account method.
 */
function _isValidTypeRequest(type: string, body?: object, method?: string) {
    if (type && schema.hasOwnProperty(type)) {
        if (body) {
            // make sure body only includes properties of the type
            let s = schema[type].properties;
            for (var p in body) {
                if (body.hasOwnProperty(p)) {
                    if (!s.hasOwnProperty(p)) {
                        // extra param in req
                        return false;
                    }
                }
            }
            
            for (var p in s) {
                if (s.hasOwnProperty(p)) {
                    if (!body.hasOwnProperty(p)) {
                        if (s[p].required) {
                            // required parameter missing
                            return false;
                        }
                    } else {
                        // make sure the param is in correct format
                        // TODO
                    }
                }
            }
        }
        return true;
    } else {
        console.log("schema doesnt have type", type, body);
        throw "Schema doesn't have type " + type;
        return false;
    }
}

/**
 * @description Adds .body property to req object, with the result of chunked post data.
 * @param {*} req The request object.
 * @return {undefined} Sets .body property on requesst. 
 */
function parseBody(req) {
    const FORM_DATA_TYPES = [
        'application/x-www-form-urlencoded',
        'multipart/form-data',
        'application/json'
    ];

    function _isDataType(header) {
        let types = FORM_DATA_TYPES.filter(t => {
            return (header.indexOf(t) >= 0);
        });
        return types.length > 0;
    }

    return new Promise(resolve => {
        if (_isDataType(req.headers['content-type'])) {
            const chunks: any = [];
            req.on('data', (chunk) => {
                chunks.push(chunk);
            });
            req.on('end', () => {
                req.body = Buffer.concat(chunks).toString();;
                try {
                    req.body = JSON.parse(req.body);
                } catch(e) {
                    throw "Error parsing POST body, not JSON? TODO";
                }
                resolve(req.body);
            });
        } else {
            req.body = null;
            resolve(null);
        }
    })
};