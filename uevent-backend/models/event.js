const { default: knex } = require('knex');
const knexfile = require('../db/knexfile');
const Entity = require('./entity');

module.exports = class Event extends Entity {
    constructor(tableName) {
        super(tableName);
    }

    async getAll(page = null, limit = 20) {
      if (page === null || page === undefined) {
        page = 0;
      }
      const knexInstance = knex(knexfile);
      const currentDatetime = knexInstance.fn.now();
      const utcCurrentDatetime = knexInstance.raw("timezone('utc', ?)", [currentDatetime]);
      return await super.table()
        .select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
        .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
        .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
        .where('event.publish_date', '<', utcCurrentDatetime)
        .groupBy('event.id')
        .orderBy('event.event_datetime', 'asc')
        .paginate({ isLengthAware: true, perPage: limit, currentPage: page });
    }

    async getById(id) {
      if (id) {
        const knexInstance = knex(knexfile);
        return await super
          .table()
          .select('event.*', 'organization.title AS org_name ', knexInstance.raw('json_agg(theme.name) AS tags'))
          .where({'event.id':id})
          .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
          .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
          .leftJoin('organization', 'event.organizer_id', '=', 'organization.id')
          .groupBy('event.id', 'organization.title')
          .orderBy('event.event_datetime', 'asc').first();
      }
    }

    async getAdminId(eventId){
        if(eventId){
            return await super.table().select('users.id as admin_id')
            .from('event')
            .join('organization', 'event.organizer_id', '=', 'organization.id')
            .join('users', 'organization.admin_id', '=', 'users.id')
            .where({ 'event.id': eventId }).first();
        }
        else return result[0];
    }

    async getEventByUserId(userId,page = null, limit = 4){
      if(userId){
          const knexInstance = knex(knexfile);
          return await super.table().select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
          .from('event')
          .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
          .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
          .join('organization', 'event.organizer_id', '=', 'organization.id')
          .join('users', 'organization.admin_id', '=', 'users.id')
          .where('users.id', '=', userId)
          .groupBy('event.id', 'organization.title')
          .orderBy('event.event_datetime', 'asc')
          .paginate({ isLengthAware: true, perPage: limit, currentPage: page });
      }
      else return result[0];
    }
    async getEventByOrgId(orgId,page = null, limit = 4){
      if(orgId){
          return await super.table().select('event.*')
          .where('organizer_id', '=', orgId).paginate({ isLengthAware: true, perPage: limit, currentPage: page });
      }
      else return result[0];
    }

  async getEventWithFilter(filters, page = null, limit = 20) {
    if (page === null || page === undefined) {
      page = 0;
    }
    const knexInstance = knex(knexfile);
    console.log(filters)
  
    const events = await knexInstance('event')
      .select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
      .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
      .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
      .where(function() {
        if (filters.format) {
          this.where('event.format', '=', filters.format);
        }
        if (filters.theme) {
          if (Array.isArray(filters.theme)) {
            this.whereIn('theme.name', filters.theme);
          } else {
            this.where('theme.name', '=', filters.theme);
          }
        }

        if (filters.event_datetime) {
          // console.log(filters.event_datetime)
          const timestamp = isNaN(Date.parse(filters.event_datetime)) ? null : new Date(filters.event_datetime).toISOString();
          if (timestamp) {
            this.where(knexInstance.raw('event.event_datetime::timestamp with time zone >= now()'));
          } else {
            this.where(knexInstance.raw("to_timestamp(event.event_datetime, 'YYYY-MM-DD HH24:MI:SS') >= ?", timestamp));
          }
        } 
      })
      
      .groupBy('event.id')
      .paginate({ isLengthAware: true, perPage: limit, currentPage: page });
    
    return events;
  }
  async getSearchAll({ filter } = {}) {
    const knexInstance = knex(knexfile);
    let query = super.table().select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
      .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
      .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
      .groupBy('event.id')
      .orderBy('event.title', 'asc');
    if (filter) {
      query = query.where((builder) => {
        builder.where('event.title', 'ilike', `${filter}%`);
      });
    }
    const events = await query;
    return events;
  }
  
  async getSearchEvent(page = null, limit = 20,{ filter } = {}) {
    if (page === null || page === undefined) {
      page = 0;
    }
    const knexInstance = knex(knexfile);
    let query = super.table().select('event.*', knexInstance.raw('json_agg(theme.name) AS tags'))
      .leftJoin('event_theme', 'event.id', 'event_theme.event_id')
      .leftJoin('theme', 'event_theme.theme_id', 'theme.id')
      .groupBy('event.id')
      .orderBy('event.title', 'asc');
    if (filter) {
      query = query.where((builder) => {
        builder.where('event.title', 'ilike', `${filter}%`);
      });
    }
    const events = await query.paginate({ isLengthAware: true, perPage: limit, currentPage: page });;
    return events;
  }

    
    async setEvent(eventData) {
      console.log(eventData)
        const knexInstance = knex(knexfile); 
        const newEvent = await 
        knexInstance.transaction(async trx => {
            // Check if tags exist, and insert any new tags
            const tagIds = []
            for (const tagName of eventData.tags) {
              const [tag] = await trx('theme').where('name', tagName)
              if (tag) {
                tagIds.push({id: tag.id})
              } else {
                const [newTag] = await trx('theme').insert({ name: tagName }).returning('id')
                tagIds.push(newTag)
              }
            }
          
            // Create event and connect to tags
            const [newEvent] = await trx('event').insert({
              organizer_id: eventData.organizer_id,
              title: eventData.title,
              description: eventData.description,
              seat: eventData.seat,
              price: eventData.price,
              event_datetime: eventData.event_datetime,
              format: eventData.format,
              location: eventData.location,
              eve_pic: eventData.eve_pic,
              publish_date: eventData.publish_date,
              is_everybody: eventData.is_everybody
            }).returning('id')
          

            for (const tagId of tagIds) {
                console.log(tagId, newEvent)
              await trx('event_theme').insert({
                event_id: newEvent.id,
                theme_id: tagId.id
              })
            }
            return newEvent
          })
          return newEvent
        }
}