import SchemaHelper from './SchemaHelper';
import ResourceHelper from './ResourceHelper';
import Config from './Config';
import { getdef, stripFirstLastSlash } from '../utils';

const METHODS = [ 'GET','PUT','POST','PATCH','DELETE' ];

export default class RouteHelper {
    
    static getApiPrefix() {
        let apiPrefix = stripFirstLastSlash(Config.apiPrefix || '');
        if (apiPrefix.length)
            apiPrefix = '/' + apiPrefix;
        apiPrefix += '/';
        return apiPrefix;
    }

    // registers REST routes for each type defined in the schema
    static registerAPIRoutes(router) {
        let apiPrefix = this.getApiPrefix();
        let schema = SchemaHelper.getSchema();
        for (let p in schema) {
            let type = schema[p];
            let urlEndpoint = apiPrefix + p;
            let registerDefaultRoutes = true;

            // register all type endpoints by default, unless the api configuration is defined for it
            if (type.api) {
                if (typeof type.api.generate != 'undefined' && !type.api.generate) {
                    continue;
                }
                urlEndpoint = apiPrefix + getdef(type.api.urlPrefix, p);

                // if this schema type has methods defined, register only those, otherwise register the defaults
                if (type.api.methods) {
                    type.api.methods.forEach(m => {
                        let method = this._getSchemaMethod(m);
                        let handler = this._getSchemaHandler(m);
                        // collection handlers, only register GET, PUT, POST on parent collection endpoints
                        if (!['GET', 'PUT', 'POST'].includes(m)) {
                            router.on(method, urlEndpoint, handler);
                            console.log('route registerd', m, urlEndpoint);
                        }
                        // regsiter individual resource endpoints, accepts all method types
                        router.on(method, urlEndpoint+'/:id', handler);
                        console.log('route registerd', m, urlEndpoint+'/:id');
                    });
                    registerDefaultRoutes = false;
                }
            }

            if (registerDefaultRoutes) {
                // register all default methods for this type
                this._registerDefaultRoutesForType(router, urlEndpoint);
            }
        }

        // register schema endpoint
        // TODO: This should be wired up through custom handler, same as other config types
        router.on('GET', apiPrefix + 'schema', (req, res) => {
            res.end(JSON.stringify(schema));
        });
    }

    private static _registerDefaultRoutesForType(router, urlEndpoint) {
        METHODS.forEach(m => {
            let handler = ResourceHelper[m.toLowerCase()];
            if (typeof handler == 'function') {
                // collection handlers, only register GET, PUT, POST on collections
                if (['GET','PUT', 'POST'].includes(m)) {
                    router.on(m, urlEndpoint, handler);
                }
                // individual resource handlers
                router.on(m, urlEndpoint+'/:id', handler);
            } else {
                throw "Could not obtain default route handler for: " + m;
            }
        });
    }

    private static _getSchemaMethod(methodDef) {
        let m = '';

        // determine method
        if (typeof methodDef == 'object') {
            if (!methodDef.type) {
                throw "Method definition requires a type property";
            } else {
                m = methodDef.type.toUpperCase();
            }
        } else {
            m = methodDef.toUpperCase();
        }
    
        if (!METHODS.includes(m)) {
            throw `${m} is not a valid method`;
        }

        return m;
    }

    private static _getDefaultHandler(method) {
        let h = ResourceHelper[method.toLowerCase()];
        if (typeof h != 'function') {
            throw "Error obtaining default handler for method: " + method;
        }
        return h;
    }

    // looks for handler if defined in the schema, otherwise returns the default handler
    private static _getSchemaHandler(methodDef) {
        let handler: undefined | ((...args)=>void) = undefined;
        let method = this._getSchemaMethod(methodDef);

        // determine handler
        if (typeof methodDef == 'object') {
            // assumes handler is defined
            if (!methodDef.handler) {
                handler = this._getDefaultHandler(method);
            } else {
                handler = methodDef.handler;
            }
        } else {
            // assume handler is default
            handler = this._getDefaultHandler(method);
            if (!handler) {
                throw "Could not obtain a handler for the given method: " + method;
            }
        }
        
        return handler;
    }
}