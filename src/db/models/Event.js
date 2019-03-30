const { Model, snakeCaseMappers, } = require('objection');

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


    static get columnNameMappers()
    {
        // If your columns are UPPER_SNAKE_CASE you can
        // use snakeCaseMappers({ upperCase: true })
        return snakeCaseMappers();
    }
}

module.exports = Event;