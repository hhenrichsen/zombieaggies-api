exports.up = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.string('discord');
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
