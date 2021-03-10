/*  Intended to be run as a compiled console script. Will generate a new migrations file based on 
    the differences between schema.json file (assumed to be "new" schema), and the contents of 
    .curr.schema.json (assumed to be the old/current schema). See package.json/webpack.config.js 
*/
import 'source-map-support/register';
import Config from '../lib/Config';
import MigrationHelper from '../lib/MigrationHelper';
import { existsSync, readFile, writeFile } from 'fs';
import * as path from 'path';
import commandLineArgs from 'command-line-args';

const DEFAULT_DIR = '';
const DEFAULT_SCHEMA_FILE = 'schema.json';
const DEFAULT_MIGRATIONS_DIR = 'migrations';

let opts = {};
try {
    opts = commandLineArgs([
        { name: 'config', type: String, multiple: false, defaultOption: DEFAULT_DIR },
        { name: 'schema-file', type: String, multiple: false, defaultOption: Config.schemaFile || DEFAULT_SCHEMA_FILE },
        { name: 'migrations-dir', type: String, multiple: false, defaultOption: Config.migrationsDir || DEFAULT_MIGRATIONS_DIR },
        { name: 'database-url', type: String, multiple: false }
    ]);
} catch(e) {
    console.log('Error parsing command line arguments:', e);
}

let basePath = path.resolve(process.cwd(), opts.config ? opts.config : DEFAULT_DIR);
let schemaFile = path.resolve(basePath, opts['schema-file'] ? opts['schema-file'] : DEFAULT_SCHEMA_FILE);
let prevSchemaFile = path.resolve(basePath, '.curr.schema.json')
let migrationsDir = path.resolve(process.cwd(), opts['migrations-dir'] ? opts['migrations-dir'] : DEFAULT_MIGRATIONS_DIR);
let currSchema: any = {}, newSchema: any = {};

///////////////////////////////////////////////////////////////////////////////

async function main() {
    let helper = new MigrationHelper();

    if (existsSync(schemaFile)) {
        newSchema = await _readFile(schemaFile);
        if (existsSync(prevSchemaFile)) {
            currSchema = await _readFile(prevSchemaFile);
        }

        if (helper.generateMigration(currSchema, newSchema, migrationsDir)) {
            // finally backup the current schema, if there's been changes
            let currSchemaFile = path.resolve(basePath, '.curr.schema.json');
            writeFile(currSchemaFile, JSON.stringify(newSchema, null, 4), (err) => {
                if (err) console.log(err);
                console.log("Successfully saved current schema:\n", currSchemaFile);
            });
        } else {
            console.log("No schema changes found.");
        }

    } else {
        console.log("Could not locate schema file at", schemaFile);
    }
}

function _readFile(path) {
    return new Promise((resolve, reject) => {
        readFile(path, "utf8", (err, data) => {
            if (err) {
                console.log("Error reading file", path);
                return reject(err);
            }
            else {
                return resolve(data ? JSON.parse(data) : '');
            }
        });
    });
}


main();