import RouteHelper from './RouteHelper';
import Config from './Config';
import DbHelper from './DbHelper';
import { enableCors } from '../utils/cors';

const generateApiDocs = () => {
    // go through schema file and get all routes
    let routes = RouteHelper.getAllRoutes();
    console.log('getAllRoutes', routes); 
    return routes;
}

export default class RestAPI {
    private router;
    private routesRegistered = false;

    constructor(configPath?, schemaPath?) {

        // Todo: move this to data layer. Need to initialize DB on app start...
        DbHelper.initialize();
        
        if (configPath && schemaPath) {
            // hack to pass to Config class, for now
            process.env['CONFIG_PATH'] = configPath;
            process.env['SCHEMA_PATH'] = schemaPath;
        }

        if (!Config.apiEnabled) {
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
        if (typeof Config.autoRegisterRoutes != 'undefined') {
            if (!Config.autoRegisterRoutes) {
                registerRoutes = false;
            }
        }
        
        if (registerRoutes) {
            this.registerRoutes();
        }
        
    }

    registerRoutes() {        
        if (!Config.apiEnabled) {
            throw "API is not enabled. Please set 'apiEnabled' to true in config.json";
        }

        if (!this.routesRegistered) {
            // registers routes from the schema configuration
            RouteHelper.registerAPIRoutes(this.router);
            this.routesRegistered = true;
        }
        
        // TODO:
        if (Config.generateApiDocs) {
            console.log('generate api documentation route')
            this.router.on('GET', '/api/docs', (req, res, ctx) => { 
                let routes = generateApiDocs(); 
                res.end(routes);
            });
        }
    }

    // Will try and handle the given request with default handlers generated from the schema.
    // Can be called directly, or passed into an application as middleware, ie. 'app.use(RestAPI.handler)' 
    handler(req, res, context?) {
        if (Config.enableCors) {
            console.log('enabling cors');
            enableCors(req, res);
            if (req.method === 'OPTIONS') {
                return;
            }
        }
        // Todo: need to extend this method to not end the request if no route is found?
        this.router.lookup(req, res, context);
        return true;
    }

}