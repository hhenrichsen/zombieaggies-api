exports.up = function (knex)
{
    return knex.schema.table('ozs', t =>
    {
        t.dropColumn('team');
    });
};

exports.down = function (knex)
{
    return knex.schema.table('ozs', t =>
    {
        t.integer('team').unique().unsigned().references('id').inTable('teams').notNullable();
    });
};
