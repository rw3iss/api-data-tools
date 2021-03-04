/*  MigrationHelper
    Utility to generate migration files based on the differences between the current JSON file schema and the database.
    The file will be saved to the configured migrations directory, and can be run using the db-migrate library.
    https://db-migrate.readthedocs.io/en/latest/API/SQL/
*/

import Config from './Config';
import { lpad, mkDirSync } from '../utils';
import SchemaHelper from './SchemaHelper';
import { writeFile } from 'fs';
import { resolve } from 'path';
import { isEqual } from 'lodash';

export default class MigrationHelper {

    generateMigration(currSchema, newSchema, schemaBasePath) {
        if (typeof Config.migrationPath == 'undefined') {
            throw "migrationPath property not found in Config. Cannot write migrations";
        }

        if (currSchema != newSchema) {
            // save clone of newSchema:
            let newSchemaClone = JSON.parse(JSON.stringify(newSchema));;

            let { up, down } = this.generateDiffOperations(currSchema, newSchema);

            if (!up.length && !down.length) {
                console.log("No schema changes found.");
                return;
            }

            let migrationCode = this.generateMigrationCode(up, down);

            this.writeFiles(migrationCode, newSchemaClone, schemaBasePath);
        }
    }

    writeFiles(migrationCode, newSchema, schemaBasePath) {
        let migrationFolder = resolve(process.cwd(), Config.migrationPath);
        let migrationFilePath = resolve(migrationFolder, this._formatDate(new Date()) + '-generated.js');

        mkDirSync(migrationFolder);

        writeFile(migrationFilePath, migrationCode, (err) => {
            if (err) console.log(err);
            console.log("Successfully generated migration file:\n", migrationFilePath);
        });

        // save current schema to .curr.schema.json file
        let currSchemaFilePath = resolve(schemaBasePath, '.curr.schema.json');
        writeFile(currSchemaFilePath, JSON.stringify(newSchema, null, 4), (err) => {
            if (err) console.log(err);
            console.log("Successfully saved current schema:\n", currSchemaFilePath);
        });
    }

    generateDiffOperations(currentSchema, newSchema): { up: [], down: [] } {
        let ops: any = {
            up: [],
            down: []
        }

        // generate create tables
        for (var resourceName in newSchema) {
            if (newSchema.hasOwnProperty(resourceName)) {
                if (!currentSchema.hasOwnProperty(resourceName)) {
                    // exists in new but not new, so create table
                    if (typeof newSchema[resourceName].persistent == 'undefined' || newSchema[resourceName].persistent) {
                        ops.up.push({ type: 'create_table', name: resourceName, data: newSchema[resourceName] });
                        ops.down.push({ type: 'drop_table', name: resourceName });
                    }
                }
            }
        }

        // generate drop tables
        for (var resourceName in currentSchema) {
            if (currentSchema.hasOwnProperty(resourceName)) {
                if (!newSchema.hasOwnProperty(resourceName)) {
                    // exists in current but not new, so drop table
                    ops.up.push({ type: 'drop_table', name: resourceName });
                    ops.down.push({ type: 'create_table', name: resourceName, data: currentSchema[resourceName] });
                }
            }
        }

        // generate add/remove columns
        for (var resourceName in newSchema) {
            if (newSchema.hasOwnProperty(resourceName)) {
                if (currentSchema.hasOwnProperty(resourceName)) {
                    // check if columns being added
                    for (var propName in newSchema[resourceName].properties) {
                        if (newSchema[resourceName].properties.hasOwnProperty(propName)) {
                            if (!currentSchema[resourceName].properties.hasOwnProperty(propName)) {
                                ops.up.push({ type: 'add_column', table: resourceName, name: propName, data: newSchema[resourceName].properties[propName] });
                                ops.down.push({ type: 'remove_column', table: resourceName, name: propName });
                            } else {
                                // check if columns being changed
                                let prevProp = currentSchema[resourceName].properties[propName];
                                let nextProp = newSchema[resourceName].properties[propName];
                                if (!isEqual(prevProp, nextProp)) {
                                    ops.up.push({ type: 'remove_column', table: resourceName, name: propName });
                                    ops.up.push({ type: 'add_column', table: resourceName, name: propName, data: newSchema[resourceName].properties[propName] });
                                    ops.down.push({ type: 'remove_column', table: resourceName, name: propName });
                                    ops.down.push({ type: 'add_column', table: resourceName, name: propName, data: currentSchema[resourceName].properties[propName] });
                                }
                            }
                        }
                    }
                    // check if columns being removed
                    for (var propName in currentSchema[resourceName].properties) {
                        if (currentSchema[resourceName].properties.hasOwnProperty(propName)) {
                            if (!newSchema[resourceName].properties.hasOwnProperty(propName)) {
                                ops.up.push({ type: 'remove_column', table: resourceName, name: propName })
                                ops.down.push({ type: 'add_column', table: resourceName, name: propName, data: currentSchema[resourceName].properties[propName] })
                            }
                        }
                    }
                }
            }
        }

        return ops;
    }

    generateMigrationCode(upOperations, downOperations) {
        let self = this, upCode = '', downCode = '';

        upOperations.forEach(o => {
            upCode += self.generateOperationCode(o) + "\n";
        });

        downOperations.forEach(o => {
            downCode += self.generateOperationCode(o) + "\n";
        });

        let code = MIGRATION_TEMPLATE.replace('{{UP_CODE}}', upCode).replace('{{DOWN_CODE}}', downCode);
        return code;
    }

    generateOperationCode(o) {
        switch (o.type) {
            case 'create_table':
                return this._generateCreateTableCode(o);
                break;
            case 'drop_table':
                return this._generateDropTableCode(o);
                break;
            case 'add_column':
                return this._generateAddColumnCode(o);
                break;
            case 'remove_column':
                return this._generateRemoveColumnCode(o);
                break;
            default:
                throw "Operation not supported: " + o.type;
        }
    }

    _generateCreateTableCode(o) {
        // Todo: append ()=>{} callback handler, which can add indexes/etc based on schema:
        o.data.properties = this._sanitizePropertyTypes(o.data.properties);
        return `\n\tdb.createTable('${o.name}', ${JSON.stringify(o.data.properties, null, 4)});`;
    }

    _generateDropTableCode(o) {
        return `\n\tdb.dropTable('${o.name}');`;
    }

    _generateAddColumnCode(o) {
        return `\n\tdb.addColumn('${o.table}', '${o.name}', ${JSON.stringify(o.data, null, 4)});`;
    }

    _generateRemoveColumnCode(o) {
        return `\n\tdb.removeColumn('${o.table}', '${o.name}');`;
    }

    _sanitizePropertyTypes(props) {
        for (var p in props) {
            let pDef = props[p];
            if (typeof pDef == 'string') {
                pDef = SchemaHelper.getSanitizedPropType(pDef);
            } else {
                pDef.type = SchemaHelper.getSanitizedPropType(pDef);
                if (!pDef.type) {
                    throw "No type property found on " + p;
                }
            }
            props[p] = pDef;
        }

        return props;
    }

    _formatDate(date: Date) {
        return [
            date.getUTCFullYear(),
            lpad(date.getUTCMonth() + 1, '0', 2),
            lpad(date.getUTCDate(), '0', 2),
            lpad(date.getUTCHours(), '0', 2),
            lpad(date.getUTCMinutes(), '0', 2),
            lpad(date.getUTCSeconds(), '0', 2)
        ].join('');
    }
}


const MIGRATION_TEMPLATE = `
'use strict';
var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
    {{UP_CODE}}
	return null;
};

exports.down = function(db) {
    {{DOWN_CODE}}
    return null;
}
`;