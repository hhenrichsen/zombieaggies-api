exports.up = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.timestamp('last_feed');
    });
};

exports.down = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.dropColumn('last_feed');
    });
};
