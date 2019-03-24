exports.up = function (knex)
{
    return knex.schema.table('permissions', t =>
    {
        t.boolean('viewOZ').defaultTo(false).notNullable();
    });
};

exports.down = function (knex)
{
    return knex.schema.table('permissions', t =>
    {
        t.dropColumn('viewOZ');
    });
};
