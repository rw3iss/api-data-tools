/*  ResourceHandler
    These are default CRUD endpoint handlers that the REST API utilizes based on the JSON schema.
    This class utilizes the ResourceDataMapper to execute the CRUD operations.
*/

import ResourceDataMapper from './ResourceDataMapper';
import SchemaHelper from './SchemaHelper';

let schema = SchemaHelper.getSchema();

export default class ResourceHandler {
    
    static async get(request, response, params?) {
        console.log("default object get", params);
        
        let d: any = null;
        let type = ResourceHandler.getTypeFromRequestUrl(request.url);

        if (!_isValidTypeRequest(type, params, 'GET')) {
            throw "Invalid request for type: " + type;
        }

        d = await ResourceDataMapper.get(type, params);
        
        response.end(JSON.stringify({ success: true, data: d }));
    }

    static async put(request, response, params?) {
        console.log("default object put");
        
        let type = ResourceHandler.getTypeFromRequestUrl(request.url);

        let d = await ResourceDataMapper.save(type, params);  

        response.end(JSON.stringify({ success: true, data: d }));
    }

    static async post(request, response, params?) {
        console.log("default object post");     
        
        let d: any = null;
        let type = ResourceHandler.getTypeFromRequestUrl(request.url);

        if (!_isValidTypeRequest(type, params, 'POST')) {
            throw "Invalid request for type: " + type;
        }

        let body = '';
        request.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        request.on('end', async () => {
            try {
                d = await ResourceDataMapper.save(type, JSON.parse(JSON.parse(body)));  
                response.end(JSON.stringify({success: true, data: d}));
            } catch(e) {
                console.log("Error parsing request body JSON", e);
                return response.end({ success: false, message: 'Error parsing request body JSON' });
            }
        });
    }

    static async patch(request, response, params?) {
        console.log("default object patch");
        
        let type = ResourceHandler.getTypeFromRequestUrl(request.url);

        if (!params.id) {
            throw "Patch requires an id parameter";
        }

        let d = await ResourceDataMapper.save(type, params);  

        response.end(JSON.stringify({ success: true, data: d }));
    }

    static async delete(request, response, params?) {
        console.log("default object delete");
        let type = ResourceHandler.getTypeFromRequestUrl(request.url);

        if (!params.id) {
            throw "Delete requires an id parameter";
        }

        let d = await ResourceDataMapper.delete(type, params);  

        response.end(JSON.stringify({ success: true, data: d }));
    }

    static getTypeFromRequestUrl(url) {
        let type = url.match(/\/([a-zA-Z0-9]{0,})\/?/); 
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
