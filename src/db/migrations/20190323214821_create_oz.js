exports.up = function (knex)
{
    return knex.schema.createTable('ozs', t =>
    {
        t.increments('id').unique().unsigned();
        t.integer('user').unique().unsigned().references('id').inTable('users').notNullable();
        t.integer('team').unique().unsigned().references('id').inTable('teams').notNullable();
    });
};

exports.down = function (knex)
{
    return knex.schema.dropTable('ozs');
};
