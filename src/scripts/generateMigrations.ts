/*  Intended to be run as a compiled console script. Will generate a new migrations file based on 
    the differences between schema.json file (assumed to be "new" schema), and the contents of 
    .curr.schema.json (assumed to be the old/current schema). See package.json/webpack.config.js 
*/

import MigrationHelper from '../lib/MigrationHelper';
import { existsSync, readFile } from 'fs';
import * as path from 'path';
import commandLineArgs from 'command-line-args';

let opts = commandLineArgs([
    { name: 'config', type: String, multiple: false, defaultOption: false }
]);

let basePath = '';
if (opts.config) {
    basePath = path.resolve(process.cwd(), opts.config);
} else {
    basePath = path.resolve(process.cwd(), 'config');
}

let schemaPath = path.resolve(basePath, 'schema.json');
let prevSchemaPath = path.resolve(basePath, '.curr.schema.json')
let currSchema: any = {}, newSchema: any = {};

///////////////////////////////////////////////////////////////////////////////

async function main() {
    let helper = new MigrationHelper();

    if (existsSync(schemaPath)) {
        newSchema = await _readFile(schemaPath);
        if (existsSync(prevSchemaPath)) {
            currSchema = await _readFile(prevSchemaPath);
        }
        helper.generateMigration(currSchema, newSchema, basePath);
    } else {
        console.log("Could not locate schema file at", schemaPath);
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