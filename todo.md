# TODO
-add method to DataMapper to just generate sql query string.
-change code to use async/await
-generate Model files file the given schema?
-generate optional controller, service, or repository classes from the schema?
-make migrations interface to go forward/backward, clear migrations, clear database, etc.
-break out livb into internal Helpers and public classes.
-objectify "schema" property into a Schema class?

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
-added DATABASE_URL environment variable support to DbHelper, so that it can be used alongside node-db-migrate with environment variables instead of config.
-added DataMapper.getOne() function.
-automatically make migrations folder if it doesn't exist.
-changed RestAPI.handle() to RestApi.handler()
