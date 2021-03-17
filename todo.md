# TODO
** add saveDebug, getDebug, etc... method, to enable printing of statements and results...
** need to load in command line args to global config state (ie. whether entering from script or native API)
    -each class should ask Config.get('VAR'), and Config should manage loading from either config file, or environments, or CLI, etc.

** DataMapper needs option to parse returned objects to some class, or at least minimimal serialization of types like Date... or use separate class.
[
-add method to DataMapper to just generate sql query string.
-change code to use async/await
-generate Model files file the given schema?
-generate optional controller, service, or repository classes from the schema?
-make migrations interface to go forward/backward, clear migrations, clear database, etc.
-break out livb into internal Helpers and public classes.
-objectify "schema" property into a Schema class?
-migration helper/creator should have an option to just print out the sql statements independent of the db-migrate platform.
    -sql statements could be stored to another file, or pass option 'format=db-migrate|raw'

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

** make section for envionrment variables:
RAPI_CONFIG = config/config.json
RAPI_SCHEMA_FILE = config/schema.json

# DONE:
-added environment variable support for schema: SCHEMA_FILE
-added DATABASE_URL environment variable support to DbHelper, so that it can be used alongside node-db-migrate with environment variables instead of config.
-added DataMapper.getOne() function.
-automatically make migrations folder if it doesn't exist.
-changed RestAPI.handle() to RestApi.handler()
