import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

let schema: {} | undefined = undefined;

function loadSchema() {
    let configPath = resolve(process.cwd(), 'config', 'schema.json');
    if (!existsSync(configPath)) {
        throw "Schema file not found at: " + configPath;
    }
    
    let s = readFileSync(configPath, { encoding: 'utf-8' });
    schema = JSON.parse(s);
}
loadSchema();

export default class SchemaHelper {
    private _schemas;

    constructor() {
        this._schemas = {};
    }

    static getSchema(name?) {
        if (!schema) {
            throw "Could not locate schema.json file";
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
                case 'string':
                case 'email':
                    return 'string';
                case 'date-time':
                    return 'datetime';
                case 'int':
                    return 'int';
                default: 
                    return 'string';
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