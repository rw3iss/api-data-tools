import RestAPI from './lib/RestAPI';
import SchemaHelper from './lib/SchemaHelper';
import ResourceHandler from './lib/ResourceHandler';
import ResourceDataMapper from './lib/ResourceDataMapper';


console.log(typeof RestAPI);
export { default as RestAPI } from './lib/RestAPI';


//export { RestAPI } from './lib/RestAPI';

/*
{
    RestAPI,
    SchemaHelper,
    ResourceHandler,
    ResourceDataMapper
}
*/

/*
Usage:
/////////////////////////
import { RestAPI } from 'api-tools';

Function requestHandler(req, res) {
    let handled = RestAPI.handle(req, res);
    if (!handled) // do other stuff
}

server = createServer(requestHandler)
server.listen(PORT, () => 
    console.log(`API server listening on http://localhost: ${PORT}`)
);

Or:
server = createServer(RestAPI.handler)


Or: 
app = express()
app.use(RestAPI.handler)

/////////////////////////
*/