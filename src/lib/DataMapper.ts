/*  DataMapper
    This class manages arbitrary CRUD operations to the data layer, based on a given JSON schema. 
*/

import SchemaHelper from './SchemaHelper';
import { DbHelper as DB } from './DbHelper';

// Does generic CRUD operations on arbitrary objects
export class DataMapper {

    schema: any;

	constructor() {
		// validate the schemas on loadup?
        // Todo: can also check database to verify the tables match
        this.schema = SchemaHelper.getSchema();
    }

    // Get an instance of the given type, accoroding to parameters.
    get(type, params?) {
		if (!type)
            throw "Cannot get without a type";

        if (typeof this.schema[type] == 'undefined')
            throw "Unknown object type for save: " + type;

        let query = `SELECT * FROM ${type}`;

        if (params) {
            if (typeof params == 'number') {
                // todo: detect primary key property name
                query += ` WHERE id=${params}`;
            } else if (typeof params == 'object') {
                var delim = ' WHERE ';
                for (var pName in params) {
                    if (params.hasOwnProperty(pName)) {
                        let pVal = params[pName];
                        let pDef = this.schema[type][pName];
                        let pQuery = this._makePropQuery(pName, pVal, pDef);
                        query += delim + pQuery;
                        delim = ' AND';
                    }
                }
            } else {
                throw "Unknown parameter type to get() method. Only integer and object supported.";
            }
        }

        return new Promise((resolve, reject) => {
			DB.query(query)
				.then((r: any) => {
					return resolve(r);
				})
				.catch((e) => {
					// Todo: log
					throw e;
				})
		});
    }

    async getOne(type, params?) {
        let r = await this.get(type, params);
        if (r.length)
            return Promise.resolve(r[0]);
        return Promise.resolve(null);
    }

	save(type, o) {
		if (!type || !o)
			throw "Cannot save without a type and an object";

        if (typeof this.schema[type] == 'undefined')
            throw "Unknown object type for save: " + type;

        let query, data, schema = this.schema[type], isInsert = false;

        if (typeof o != 'object') {
            throw "Object parameter must be an object, " + typeof o + " found";
        }

        if (o['id']) {
            // assume an update
            var valString = '', delim = ' ';
            for (var p in schema.properties) {
                if (o.hasOwnProperty(p)) { 
                    valString += delim + p + '=' + this.tryEscape(o[p]);
                    delim = ', ';
                }
            }

            query = `UPDATE ${type} SET ${valString} WHERE id=${o['id']}`;
        } else {
            // assume an insert
            isInsert = true;
            var propString = '', valString = '', delim = '';
            for (var p in schema.properties) {
                
                if (o.hasOwnProperty(p)) {
                    let propType =  SchemaHelper.getSanitizedPropType(schema.properties[p]);
                    propString += delim + p;
                    valString += delim + this.tryEscape(o[p], propType);
                    delim = ',';
                }
            }

            query = `INSERT INTO ${type} (${propString}) VALUES (${valString});
                    SELECT LAST_INSERT_ID() as last_id;`;
        }

		return new Promise((resolve, reject) => {
			DB.query(query)
				.then((r: any) => {
					// set inserted id
					if (isInsert) {
						if (r[r.length-1][0].last_id) {
                            o.id = r[r.length-1][0].last_id;
						}
					}

					return resolve(o);
				})
				.catch((e) => {
					// Todo: log
					throw e;
				})
		});
	}

    delete(type, params) {
        if (!type)
            throw "Cannot delete without a type";

        if (typeof this.schema[type] == 'undefined')
            throw "Unknown object type for save: " + type;

        if (!params.id) {
            throw "Delete requires an id parameter";
        }

        let query = `DELETE FROM ${type}`;// WHERE id=${params.id}`;

        if (params) {
            var delim = ' WHERE ';
            for (var pName in params) {
                if (params.hasOwnProperty(pName)) {
                    let pVal = params[pName];
                    let pDef = this.schema[type][pName];
                    let pQuery = this._makePropQuery(pName, pVal, pDef);
                    query += delim + pQuery;
                    delim = ' AND';
                }
            }
        }

        return new Promise((resolve, reject) => {
            DB.query(query)
                .then((r: any) => {
                    return resolve(r);
                })
                .catch((e) => {
                    // Todo: log
                    throw e;
                })
        });
    }
    
	tryEscape(propVal, propType?) {
		if (typeof propType == 'undefined')
            propType = typeof propVal;
            
        if (['string', 'email', 'enum'].includes(propType)) {
			return DB.escapeString(propVal)
        }

		if (propType == 'date-time' || propType == 'datetime') {
            // convert val to mysql date string
            return DB.escapeString(propVal);
		}
		
		return propVal;
    }

    // makes a 'prop=val' string, where val is properly escaped depending on its type
    _makePropQuery(pName, pVal, pDef) {
        let q = pName;
        let pType = this._getPropType(pVal, pDef);
        let eVal = this.tryEscape(pVal, pType);
        return `${pName}=${eVal}`;
    }

    _getPropType(propVal, propDef?) {
        let type = '';
        if (typeof propDef == 'object') {
            if (!propDef.type && !propDef.enum) {
                throw "Property definition requires a type property";
            } else if (propDef.enum) {
                type = 'enum';
            }
            else {
                type = propDef.type.toLowerCase();
            }
        } else if (typeof propDef == 'string') {
            type = propDef.toLowerCase();
        } else {
            type = typeof propVal;
        }
        return type;
    }
}

export default new DataMapper();