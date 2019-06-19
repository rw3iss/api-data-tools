**Usage:**

(Note: Currently only MySQL-based databases will work, but is extensible and easily adaptable to others)

Must first define a 'config/config.json' file:

```
{
    "apiEnabled": true,
    "autoRegisterRoutes": true,
    
    "migrationPath": "scripts/migrations",

    "database": {
        "driver": "mysql",
        "host": "",
        "user": "",
        "password": "",
        "database": "",
        "multipleStatements": true
    }
}
```


And also a config/schema.json file with your schema. This uses the node-db-migrate property types, and the standard JSON specification, ie:

```
{
    "users": {
        "properties": {
            "id": { 
                "type": "int" ,
                "primaryKey": true, 
                "autoIncrement": true
            },
            "name": "string",
            "email": {
                "type": "email",
                "isIndex": true
            },
            "registered": "date-time",
            "role": {
                "enum": ["user", "superuser", "admin"]
            },
            "lastLoggedIn": "date-time"
        },

        "required": [
            "name", "email", "registered", "role"
        ],
        
        "api": {
            "generate": true
        }
    }
}
```


Then to use it in your application, ie. vanilla node:

```
import { RestAPI } from 'api-schema-tools';

let api = new RestAPI();

function requestResponseHandler(request, response) {
    api.handle(request, response);
}

let apiServer = http.createServer(requestResponseHandler);
```

Or within an Express-like application, just pass the API handler:

```
import * as express from 'express';
import { RestAPI } from 'api-schema-tools';

let app = express();
let api = new RestAPI();

app.use(api.handle);
```



**Other things this library does:**

-Generates migration files whenever there is a change to the schema.json file (keeps track of the previous file and compares).

-DB helper classes to automatically CRUD any arbitrary object defined in the schema.
