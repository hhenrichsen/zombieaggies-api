exports.up = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.string('code').nullable().index('code');
    })
};

exports.down = function (knex)
{
    return knex.schema.table('users', t =>
    {
        t.dropColumn('code');
    })
};
