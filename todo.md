# DOING:
* ClientAPI:
    -add authentication header

-add user system:
    -r = APIClient.auth.login(...): response stores token
    -APIClient.get/post/put, etc:
        -run hooks through all extensions to modify the request headers, etc...
        -auth extension should add Authorization header
        -backend should pass request through all extensions
            -auth extension should see Auth header, and look user up and put into request

# TODO
-change code to use async/await

-make migrations interface to go forward/backward, clear migrations, clear database, etc.

-break out lib into internal Helpers and public classes.

-add method to DataMapper to just generate sql query string.

-objectify "schema" property into a Schema class?

** add in APIClient caching layer option...

** Add a generate model command, or regenerate all models, and option to re-generate models on miration changes.
    -Model files generated can then be extended, add hooks for serialization/deserialization.
    
** Generate and update model files from schema config?
    -model-dir
    -rapi gen model modelName --model-dir=src/data/models
    * - rapi gen rebuildModels
        -run schema, migrations
        -rebuild model files from schema

** Fix dropping foreign keys with constraints: delete the constraint first.. ?
    [ERROR] Error: ER_FK_COLUMN_CANNOT_DROP: Cannot drop column 'lastEventId': needed in a foreign key constraint 'user_last_event_id_fk'

** If migrations fail, don't save that they've run... or rather start them all in a transaction?

* Main add Validation, Serialization, and Lazy Loading of related model as config options.
    
** Need options to serialize and deserialize fields per model... 
    -ie. object to strings...

** need to load in command line args to global config state (ie. whether entering from script or native API)
    -each class should ask Config.get('VAR'), and Config should manage loading from either config file, or environments, or CLI, etc.

** DataMapper needs option to parse returned objects to some class, or at least minimimal serialization of types like Date... or use separate class.
** DataMapper.save needs to allow saving of partial data, but return full object.
    -add option to hydrate full objects, or return the full object in query response...
    * Save needs to serialize data types like date strings?

** Add utilities to add dummy data...

** Add a /api/routes endpoint which shows API docs

-migration helper/creator should have an option to just print out the sql statements independent of the db-migrate platform.
    -sql statements could be stored to another file, or pass option 'format=db-migrate|raw'

* ResourceHandler:
    -Enable validation through config property... Config.validateApiParameters
    -add more robust Validation: _validateTypeFromRequest. Use Validation library.

* remove "properties" from schema.

* remove id/primary key field from DataMapper.save/update.

** make section for envionrment variables:
ADT_CONFIG = config/config.json
ADT_SCHEMA_FILE = config/schema.json


# LATER:
-integrate an auxiliary user/authentication system:
-add feature to add dummy data to DB based on schema models
-add config option to auto-run migrations on recompile (or app startup).
-integrate node-db-migrate full environment variable support:
{
  "dev": {
    "user": {"ENV": "user"},
    "driver": "cockroachdb",
    "database": {"ENV": "database"},
    "native": true,
    "host": { "ENV": "host" },
    "port": 26257,
    "ssl": {
      "sslrootcert": { "ENV": "ca_crt" },
      "sslcert": { "ENV": "ssl_cert" },
      "sslkey": { "ENV": "ssl_key" },
      "sslmode": { "ENV": "ssl_mode" }
    }
  }
}

# DONE:
-cleaned up DbHelper and DataMapper code.
-added debug() method to print trace/debug logs if process.env.DEBUG = true.
-added environment variable support for schema: SCHEMA_FILE
-added DATABASE_URL environment variable support to DbHelper, so that it can be used alongside node-db-migrate with environment variables instead of config.
-added DataMapper.getOne() function.
-automatically make migrations folder if it doesn't exist.
-changed RestAPI.handle() to RestApi.handler()
-bug: diff code sees 'email' data type as a changing field from original schema.


# DATABASE BOOTSTRAPPING


# NAME
api-data-tools
ADT
api-gen
DAPI