/*  ResourceHelper
    These are default CRUD endpoint handlers that the REST API utilizes based on the JSON schema.
    This class utilizes the DataMapper to execute the CRUD operations.
*/
import DataMapper from './DataMapper';
import SchemaHelper from './SchemaHelper';
import RouteHelper from './RouteHelper';

let schema = SchemaHelper.getSchema();

export default class ResourceHelper {
    
    static async get(request, response, params?) {
        console.log("default object get", params);
        
        let d: any = null;
        let type = this.getTypeFromRequestUrl(request.url);

        if (!_isValidTypeRequest(type, params, 'GET')) {
            throw "Invalid request for type: " + type;
        }

        d = await DataMapper.get(type, params);
        
        response.end(JSON.stringify({ success: true, data: d }));
    }

    static async put(request, response, params?) {
        console.log("default object put");
        
        let type = this.getTypeFromRequestUrl(request.url);

        let d = await DataMapper.save(type, params);  

        response.end(JSON.stringify({ success: true, data: d }));
    }

    static async post(request, response, params?) {
        console.log("default object post");     
        
        let d: any = null;
        let type = this.getTypeFromRequestUrl(request.url);

        if (!_isValidTypeRequest(type, params, 'POST')) {
            throw "Invalid request for type: " + type;
        }
 
        try {
            let data: any = await parseBody(request);
            console.log('saving', type, data);
            d = await DataMapper.save(type, data);
            response.end(JSON.stringify({ success: true, data: d }));
        } catch(e) {
            console.log("Error parsing request body JSON", e);
            return response.end({ success: false, message: 'Error parsing request body JSON' });
        }
    }

    static async patch(request, response, params?) {
        console.log("default object patch");
        
        let type = this.getTypeFromRequestUrl(request.url);

        if (!params.id) {
            throw "Patch requires an id parameter";
        }

        let d = await DataMapper.save(type, params);  

        response.end(JSON.stringify({ success: true, data: d }));
    }

    static async delete(request, response, params?) {
        console.log("default object delete");
        let type = this.getTypeFromRequestUrl(request.url);

        if (!params.id) {
            throw "Delete requires an id parameter";
        }

        let d = await DataMapper.delete(type, params);  

        response.end(JSON.stringify({ success: true, data: d }));
    }

    static getTypeFromRequestUrl(url) {
        let apiPrefix = RouteHelper.getApiPrefix();
        url = url.replace(apiPrefix, '');
        console.log("get type from url", url);

        let type = url.match(/\/?([a-zA-Z0-9]{0,})\/?/); 
        return type[1];
    }
}


// validates that the type exists and, if given, the params are valid according to the type's schema
function _isValidTypeRequest(type, params?, method?) {
    if (schema.hasOwnProperty(type)) {
        if (params) {
            // make sure params only includes properties of the type
            let s = schema[type].properties;
            for (var p in params) {
                if (params.hasOwnProperty(p)) {
                    if (!s.hasOwnProperty(p)) {
                        // extra param in request
                        return false;
                    }
                }
            }
            
            for (var p in s) {
                if (s.hasOwnProperty(p)) {
                    if (!params.hasOwnProperty(p)) {
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
        console.log("schema doesnt have type", type, params);
        throw "Schema doesn't have type " + type;
        return false;
    }
}


// adds .body property to request object, with the result of chunked post data.
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