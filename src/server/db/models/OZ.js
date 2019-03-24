const { Model, } = require('objection');

class OZ extends Model
{
    static get tableName()
    {
        return 'ozs';
    }

    static get relationMappings()
    {
        const User = require('./User');
        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    to: 'ozs.user',
                    from: 'users.id',
                },
            },
        };
    }
}

module.exports = OZ;