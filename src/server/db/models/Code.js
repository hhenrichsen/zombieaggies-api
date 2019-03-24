const {Model,} = require('objection');

class Code extends Model
{
    static get tableName()
    {
        return 'codes';
    }

    static get relationMappings()
    {
        const User = require('./User');
        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'codes.user',
                    to: 'users.id',
                },
            },
        }
    }
}

module.exports = Code;