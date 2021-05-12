require('dotenv').config();
//import 'source-map-support/register';
import RestAPI from './lib/RestAPI';
import MigrationHelper from './lib/MigrationHelper';
import ResourceHandler from './lib/ResourceHandler';
import DbHelper from './lib/DbHelper';
import DataMapper from './lib/DataMapper';
import CLI from './lib/CLI';
import APIClient from './client-sdk/APIClient';

export { 

    // Generate a REST API from the schema.
    RestAPI,

    // Generate migration scripts from the schema.
    MigrationHelper,

    // Exposes CRUD API endpoints for models based on the schema.
    // ResourceHandler,

    // Object serialization interface to database.
    DataMapper,

    // Interface to work with the underlying database directly.
    DbHelper,

    // If wanting to use the CLI interface.
    CLI,

    // temporarily putting Client here, but should be a separate package?
    APIClient

};