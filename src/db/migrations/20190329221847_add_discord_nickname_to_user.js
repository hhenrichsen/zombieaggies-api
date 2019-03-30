exports.up = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.string('discord').index('discord');
        t.string('nickname');
    });
};

exports.down = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.dropColumns('discord', 'nickname');
    });
};
