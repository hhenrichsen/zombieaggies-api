exports.up = function (knex)
{
    knex.table('users', t =>
    {
        t.boolean('dead').defaultTo(false).notNullable();
    });
};

exports.down = function (knex)
{
    knex.table('users', t =>
    {
        t.dropColumn('dead');
    });
};
