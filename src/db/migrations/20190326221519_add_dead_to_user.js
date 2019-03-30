exports.up = function (knex)
{
    // return knex.schema.table('users', t =>
    // {
    //     t.boolean('dead').defaultTo(false).notNullable();
    // });
};

exports.down = function (knex)
{
    // return knex.schema.table('users', t =>
    // {
    //     t.dropColumn('dead');
    // });
};
