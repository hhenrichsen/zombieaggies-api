const { Model, snakeCaseMappers, } = require('objection');

class User extends Model
{
    static get tableName()
    {
        return 'users';
    }

    static get relationMappings()
    {
        const Team = require('./Team');
        const Permission = require('./Permission');
        const Code = require('./Code');
        return {
            alliance: {
                relation: Model.BelongsToOneRelation,
                modelClass: Team,
                join: {
                    from: 'users.team',
                    to: 'teams.id',
                },
            },
            permissions: {
                relation: Model.HasOneRelation,
                modelClass: Permission,
                join: {
                    from: 'permissions.user',
                    to: 'users.id',
                },
            },
            code: {
                relation: Model.HasOneRelation,
                modelClass: Code,
                join: {
                    from: 'codes.user',
                    to: 'users.id',
                },
            },
        };
    }


    static get columnNameMappers()
    {
        // If your columns are UPPER_SNAKE_CASE you can
        // use snakeCaseMappers({ upperCase: true })
        return snakeCaseMappers();
    }

    static get jsonSchema()
    {
        return {
            type: 'object',
            required: [ 'username', 'firstname', 'lastname', 'password', 'title', 'aNumber', 'bandanna', ],

            properties: {
                id: { type: 'integer', },
                username: {
                    type: 'string',
                    pattern: "^(([^<>()[\\]\\\\.,;:\\s@\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$",
                    minLength: 1,
                    maxLength: 255,
                },
                firstname: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                },
                lastname: {
                    type: 'string',
                    minLength: 1,
                    maxLength: 255,
                },
                phone: {
                    type: 'string',
                    pattern: "^$|(?:[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6})",
                },
                aNumber: {
                    type: 'string',
                    pattern: "A[\\d]{8}",
                    minLength: 9,
                    maxLength: 9,
                },
                bandanna: {
                    type: 'boolean',
                    default: false,
                },
                createdAt: { type: 'string', },
                updatedAt: { type: 'string', },
                team: {
                    type: 'integer',
                    default: 1,
                },
                tags: {
                    type: 'integer',
                    default: 0,
                },
                code: {
                    type: 'string',
                },
                lastFeed: {
                    type: 'string',
                },
                dead: {
                    type: 'boolean',
                    default: false,
                },
            },
        };
    }
}

module.exports = User;