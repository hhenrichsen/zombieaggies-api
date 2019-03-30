const {Model,} = require('objection');

class Location extends Model
{
    static get tableName()
    {
        return 'locations';
    }

    static get relationMappings()
    {
        const Team = require('./Team');
        return {
            team: {
                relation: Model.BelongsToOneRelation,
                modelClass: Team,
                join: {
                    from: 'locations.owner',
                    to: 'teams.id',
                },
            },
        }
    }
}

module.exports = Location;