const {Model,} = require('objection');

class Permission extends Model
{
    static get tableName()
    {
        return 'permissions';
    }

    static get relationMappings()
    {
        const User = require('./User');
        return {
            owner: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    to: 'permissions.user',
                    from: 'users.id',
                },
            },
        }
    }
}

module.exports = Permission;