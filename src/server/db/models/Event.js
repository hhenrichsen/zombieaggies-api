const {Model,} = require('objection');

class Event extends Model
{
    static get tableName()
    {
        return 'events';
    }

    static get relationMappings()
    {
        const User = require('./User');
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'event.subject',
                    to: 'locations.owner',
                },
            },
        }
    }
}

module.exports = Event;