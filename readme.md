# Description

This is a suite of tools to help with automatically generating API's, DB migration files, and serialize schema objects to and from a database, all based on a schema.json file.

Each feature can be used independently (ie. you can just use this for generation DB migration files, or just use it to serialize an object model to/from the database, or to just host a REST API based on the schema file, etc).

#

# Configuration:

Add a config directory to the project.
Inside this, add a config file with some parameters for whichever featues you'd like to use. 

At least specify the database connection and the folder where you'd like the migrations generated:
```
{
    "database": {
        "driver": "mysql",
        "host": "127.0.0.1",
        "user": "user",
        "password": "password",
        "database": "yourdatabase",
        "multipleStatements": true
    },
    
    "migrationPath": "scripts/migrations",
}

```

You can also add options for the API generation:
```
    "apiEnabled": true,
    "autoRegisterRoutes": true,
```

# schema.json

Then, also add a schema.json file to this directory, defining your schema. 
See examples folder for example schemas.
This uses the node-db-migrate property types, and the standard JSON specification, ie:

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
            "cityId": {
                "type": "int",
                "foreignKey": {
                    "name": "users_city_city_id_fk",
                    "table": "cities",
                    "rules": {
                        "onDelete": "CASCADE",
                        "onUpdate": "RESTRICT"
                    },
                    "mapping": "id"
                }
            },
            "registered": "datetime",
            "role": {
                "enum": ["user", "superuser", "admin"]
            },
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

Notice there is an additional "api" property to specify whether you want to automatically generate the API for a specific type, if that feature is used.

For reference: https://db-migrate.readthedocs.io/en/latest/API/SQL/
Data types: https://github.com/db-migrate/shared/blob/master/data_type.js



# Rest API:

To use the automatically-generated REST API it in your application, ie. vanilla node:

```
import http from 'http';
import { RestAPI } from 'api-tools';

let api = new RestAPI();

function requestHandler(req, res) {
    api.handle(req, res);
}

const apiServer = http.createServer(requestHandler);
apiServer.listen(8080);
```

This will automatically create CRUD endpoints per your object schema defined in schema.json.
For instance, if you have a user object, you will have a CRUD endpoint at which accepts a JSON body according to the schema:

`GET,POST,PUT,DELETE http://localhost:8080/user/:id`


Or within an Express-like application, just pass the API handler:

```
import * as express from 'express';
import { RestAPI } from 'api-tools';

let app = express();
let api = new RestAPI();

app.use(api.handler);
```

# Data Mapper:

This module will allow you to serialize objects to the database according to the project's schema 
file.

Example usage:
```
import { DataMapper } from 'api-tools'

// Get an object of type user:
let user = await DataMapper.get('users', { id: 21 });

// Create or update an object of type user:
let user = await DataMapper.save('users', { ...userProperties });
```

# Migrations:
This all works, but the commands need some aliases into the public interface. For now, you can work around it as described below.

## Generating Migrations

You can copy the built scripts/generateMigrations.js file, or refer to it manually on your global or project-based node-modules/api-tools/build/generateMigrations.js. 

Run this command to generate new migrations files from the current schema.json file. This command will make a backup file calleed '.curr.schema.json' to compare any new schema changes to:
```
"CONFIG_PATH=config/config.dev.json node scripts/generateMigrations.js",
"migrate": "db-migrate up --config=config/database.json --migrations-dir=scripts/migrations"
```

(Note: Currently only MySQL-based databases will work, but is extensible and easily adaptable to others)

## Running Migrations:

```
db-migrate up --config=config/database.json --migrations-dir=scripts/migrations
```
