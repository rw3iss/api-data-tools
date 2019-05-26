import RouteHelper from './RouteHelper';
import * as config from 'config/config.json';
import { resolve } from 'path';

export default class RestAPI {
    private router;
    private routesRegistered = false;

    constructor() {
        if (!config.apiEnabled) {
            return;
        }
        
        // setup the route lookup module
        this.router = require('find-my-way')({  
            ignoreTrailingSlash: true,
            defaultRoute: (req, res) => {
                res.end(JSON.stringify({
                    success: false,
                    message: 'Endpoint not found.'
                }));
            }
        });

        let registerRoutes = true;
        if (typeof config.autoRegisterRoutes != 'undefined') {
            if (!config.autoRegisterRoutes) {
                registerRoutes = false;
            }
        }
        
        if (registerRoutes) {
            this.registerRoutes();
        }
    }

    registerRoutes() {
        if (!this.routesRegistered) {
            // registers routes from the schema configuration
            RouteHelper.registerAPIRoutes(this.router);
            this.routesRegistered = true;
        }
    }

    // Will try and handle the given request with default handlers generated from the schema.
    // Can be called directly, or passed into an application as middleware, ie. 'app.use(RestAPI.handle)' 
    handle(request, response, context?) {
        console.log("Handing route...", resolve(process.cwd(), config.migrationPath));

        if (!config.apiEnabled) {
            throw "API is not enabled. Please set 'apiEnabled' to true in config.json";
        }
 
        // Todo: need to extend this method to not end the request if no route is found?
        this.router.lookup(request, response, context);
        
        return true;
    }

}