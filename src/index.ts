import 'source-map-support/register';
import RestAPI from './lib/RestAPI';
import MigrationHelper from './lib/MigrationHelper';
import ResourceHelper from './lib/ResourceHelper';
import { DbHelper } from './lib/DbHelper';
import DataMapper from './lib/DataMapper';

export { 

    // Generate a REST API from the schema.
    RestAPI,

    // Generate migration scripts from the schema.
    MigrationHelper,

    // Exposes CRUD API endpoints for models based on the schema.
    //ResourceHelper,

    // Object serialization interface to database.
    DataMapper,

    // Interface to work with the underlying database directly.
    DbHelper

};