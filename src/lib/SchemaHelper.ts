import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import Config from './Config'

let schema: {} | undefined = undefined;

(function loadSchema() {
    // see if there's a config entry
    let schemaFile = "";
    if (Config.schemaFile) {
        // try config file
        schemaFile = Config.schemaFile;
    } else if (process.env.SCHEMA_FILE) {
        // try env
        schemaFile = process.env.SCHEMA_FILE;
    } else {
        // try default
        schemaFile = 'config/schema.json';
    }

    schemaFile = resolve(process.cwd(), schemaFile);
    if (!existsSync(schemaFile)) {
        throw "Schema file not found at: " + schemaFile;
    }

    try {
        schema = JSON.parse(
            readFileSync(schemaFile, { encoding: 'utf-8' })
        );
    } catch(e) {
        console.log(`Error parsing ${schemaFile}`, e);
    }
})();

export default class SchemaHelper {
    private _schemas;

    constructor() {
        this._schemas = {};
    }

    static getSchema(name?) {
        if (!schema) {
            throw "schema.json file not loaded.";
        }

        if (name) {
            if (typeof schema[name] != 'undefined') {
                return schema[name];
            } else {
                throw `Type ${name} does not exist within the schema`;
            }
        }

        return schema;
    }
    
    /*     
    validateSchema(name, data) {
    } 
    */

    static getPropType(pDef) {
        if (typeof pDef == 'string') {
            return pDef;
        } else {
            if (pDef.type) {
                return pDef.type;
            } else if (pDef.enum) {
                return 'string';
            } else {
                throw "No type found for property.";
            }
        }
    }
    
    // Returns the given definition SQL type for given input property types
    static getSanitizedPropType(pDef) {
        function _san(type) {
            // Todo: move to type map
            switch(type) {
                case 'email':
                    return 'string';
                case 'date-time':
                    return 'datetime';
                default: 
                    return type.toLowerCase();
            }
        }

        let type = '';
        if (typeof pDef == 'string') {
            type = pDef;
        } else {
            if (pDef.type) {
                type = pDef.type;
            } else if (pDef.enum) {
                type = 'string';
            } else {
                throw "No type found for property.";
            }
        }

        return _san(type);
    }

}