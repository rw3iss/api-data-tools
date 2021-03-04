# TODO
-change code to use async/await
-generate Model files file the given schema?
-generate optional controller, service, or repository classes from the schema?
-use config parameter in entire project, and not a mix between CONFIG_PATH environment and 
-make migrations interface to go forward/backward, clear migrations, clear database, etc.
-break out livb into internal Helpers and public classes.
-objectify "schema" property into a Schema class?

# DONE:
-added DataMapper.getOne() function.
-automatically make migrations folder if it doesn't exist.
-changed RestAPI.handle() to RestApi.handler()