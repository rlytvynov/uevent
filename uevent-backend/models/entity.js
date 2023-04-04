const  db = require('knex')(require('../db/knexfile'));

module.exports = class Entity {
    constructor(tableName) {
        this.tableName = tableName;
    }

    table () {
        return db(this.tableName)
    }

    async get(searchObj, isAll = false) {
        const result =  await this.table().select('*').where(searchObj);
        if (isAll) return result;
        else return result[0];
    }

    // i guess it d be better to delete this
    async getById(id) {
        return await this.table().select('*').where({id: id}).first();
    }

    async getAll() {
        return await this.table().select('*');
    }

    async set(setObj) {
        if (setObj.id) {
            return await this.table().returning('*').where({id: setObj.id}).update(setObj)
            .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
        }
        return await this.table().returning('*').insert(setObj)
        .catch((error)=>{console.error(`Error inserting into ${this.tableName}:`, error); throw error});
    }

    async del(searchObj) {
        return await this.table().where(searchObj).del();
    }
}