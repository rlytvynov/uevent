const Entity = require('./entity');

module.exports = class User extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async get(login, email){
        if (email) {
            return await super.table().select('*')
            .where('login', '=', login)
            .orWhere('email', 'like', `%${email}`)
            .first();
        }
        return super.get({login: login});
    }
    async getAllOrganizationsByUserId(userId) {
        if (userId) {
          return await super.table()
            .join('organization', 'users.id', '=', 'organization.admin_id')
            .select('organization.id', 'organization.title', 'organization.description', 'organization.location', 'organization.org_pic', 'organization.phone_number')
            .leftJoin('event', 'organization.id', '=', 'event.organizer_id')
            .count('event.id as event_count')
            .where('users.id', userId)
            .groupBy('organization.id');
        } else {
          return [];
        }
      };

    async findByIdAndUpdate(userId,password){
        return await super.table().where({id:userId}).update({password: password});
    }
    
    async getUserByEmail(email){
        if(email){
            return await super.table().select('users.*').where('email',email).first();
        }
    }
}
