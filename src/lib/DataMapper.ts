import SchemaHelper from './SchemaHelper';
import DbHelper from './DbHelper';
import { debug } from '../utils/utils';
import { lchmod } from 'node:fs';
import { compileSchema } from 'ajv/dist/compile';

/**
 * Manages arbitrary CRUD operations to the data layer schema objects.
 */
export class DataMapper {

    /**
     * @description The schema reference stored for usage.
     * @type {object}
     */
    schema: any;

    /**
     * Creates an instance of DataMapper.
     */
    constructor() {
		// validate the schemas on loadup?
        // Todo: can also `check database to verify the tables match
        this.schema = SchemaHelper.getSchema();
    }

    /**
     * @description Get an instance of the given type, accoroding to parameters.
     * @param {string} type
     * @param {*} [params]
     * @param {*} [limit]
     * @return {$type} Set of matching objects.
     */
    get = async (type: string, params?, limit?) => {
        try {
            let query = this.selectQueryString(type, params, limit);
            let r = await DbHelper.query(query);

//#ifdef SERIALIZE_DATA_MODELS
            //console.log("TODO: serialize data model...");
//#endif

            debug('DataMapper.get result', r);
            return r;
        } catch(e) {
            console.log('DataMapper.get error', e)
            throw e;
        }
    }

    /**
     * @description Gsets the first instance of returned set, or null if none found.
     * @param {string} type
     * @param {object} [params]
     * @param {boolean} [serialize=false]
     * @return {$type | null} The first result, or null if none found.
     */
    async getOne(type: string, params?: object, serialize: boolean = false) {
        let r = await this.get(type, params, 1);
        return r.length ? r[0] : null;
    }

    /**
     * @description Updates an object if it exists, or otherwise inserts a new one.
     * @param {string} type
     * @param {object} o
     * @return {$type} Returns the new or updated object.
     */
    save = async (type: string, o: object) => {
        // todo: should allow editing of fields but return full object...
        try {
            let query = this.upsertQueryString(type, o);
            console.log('query', query)
            debug('adt debug', query);
            let r = await DbHelper.query(query);
            // todo: check if id property exists on schema
            o.id = o.id || r[r.length-1][0]?.last_id;
            debug('DataMapper.save result', o);
            return o;
        } catch(e) {
            debug('DataMapper.save error', e);
            throw e;
        }
	}

    /** 
     * @description Deletes the object matching the parameters.
     * @param {string} type
     * @param {object} params
     * @return {*} The delete result.
     */
    delete = async (type: string, params) => {
        try {
            let query = this.deleteQueryString(type, params);
            console.log('Delete.....', query)
            let r = await DbHelper.query(query);
            debug('DataMapper.delete result', r);
            return r;
        } catch(e) {
            debug('DataMapper.delete error', e);
            throw e;
        }
    }
    
    /////////////////////////////////////////////////////////////

    selectQueryString(type, params?, limit?) {
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
                query += this.whereString(type, params);
            } else {
                throw "Unknown parameter type to get() method. Only integer and object supported.";
            }
        }
                
        if (limit) {
            query += ` LIMIT ${limit}`;
        }

        return query;
    }
    
    // todo: support more where clauses
    upsertQueryString(type, o) {
        if (!type || !o)
            throw "Cannot save without a type and an object";

        if (typeof this.schema[type] == 'undefined')
            throw "Unknown object type for save: " + type;

        if (typeof o != 'object') {
            throw "Object parameter must be an object, " + typeof o + " found";
        }

        let query, data, schema = this.schema[type];
        let sp = schema.properties;

        if (o['id']) {
            // assume an update
            var valStr = '', delim = ' ';
            for (var p in sp) {
                if (o.hasOwnProperty(p)) { 
                    let propType = this._getPropType(null, sp[p]);
                    valStr += delim + p + '=' + this.escape(o[p], propType);
                    delim = ', ';
                }
            }
            query = `UPDATE ${type} SET ${valStr} WHERE id=${o['id']}`;
        } else {
            // assume an insert
            var propString = '', valStr = '', delim = '';
            for (var p in sp) {
                if (o.hasOwnProperty(p)) {
                    let propType = this._getPropType(null, sp[p]);
                    propString += delim + p;
                    valStr += delim + this.escape(o[p], propType);
                    delim = ',';
                }
            }
            query = `INSERT INTO ${type} (${propString}) VALUES (${valStr});
                    SELECT LAST_INSERT_ID() as last_id;`;
        }

        return query;
    }

    deleteQueryString(type, params?) {
        if (!type)
            throw "Cannot delete without a type";

        if (typeof this.schema[type] == 'undefined')
            throw "Unknown object type for save: " + type;

        let query = `DELETE FROM ${type}`;// WHERE id=${params.id}`;

        if (params) {
            query += this.whereString(type, params);
        }
        
        return query;
    }

    // Add support for IS NULL and LIKE '%${pVal}'
    whereString(type, params) {
        let str = '';
        var delim = ' WHERE ';
        for (var pName in params) {
            if (params.hasOwnProperty(pName)) {
                let pVal = params[pName];
                let pDef = this.schema[type][pName];
                let pQuery = this._makePropValString(pName, pVal, pDef);
                str += delim + pQuery;
                delim = ' AND ';
            }
        }
        return str;
    }

	escape(propVal, propType?) {
        if (propVal == null) return null;
        
		if (typeof propType == 'undefined')
            propType = typeof propVal;

        // stringify Date/object representations first
        // TODO: these escape-per-type definitions might do better elsewhere
        if (typeof propVal == 'object' && (propType == 'string' || propType == 'text')) {
            propVal = JSON.stringify(propVal);
        } else if (propVal instanceof Date) {
            return `'${propVal.toISOString().slice(0, 19).replace('T', ' ')}'`;
        }
        
        if (['string', 'text', 'char', 'enum', 'datetime'].includes(propType)) {
			return DbHelper.escapeString(propVal)
        }

		return propVal;
    }

    // makes a 'prop=val' string, where val is properly escaped depending on its type
    _makePropValString(pName, pVal, pDef) {
        let q = pName;
        let pType = this._getPropType(pVal, pDef);
        let eVal = this.escape(pVal, pType);
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
        let t = SchemaHelper.getSanitizedPropType(type);
        return t;
    }
}

export default new DataMapper();