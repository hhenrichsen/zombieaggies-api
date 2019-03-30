const {Model,} = require('objection');

class Team extends Model
{
    static get tableName()
    {
        return 'teams';
    }

    static get relationMappings()
    {
        const Location = require('./Location');
        const User = require('./User');
        return {
            locations: {
                relation: Model.HasManyRelation,
                modelClass: Location,
                join: {
                    from: 'teams.id',
                    to: 'locations.owner',
                },
            },
            users: {
                relation: Model.HasManyRelation,
                modelClass: User,
                join: {
                    from: 'teams.id',
                    to: 'users.team',
                },
            },
        }
    }
}

module.exports = Team;