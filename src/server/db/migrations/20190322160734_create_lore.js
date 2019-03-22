
exports.up = function(knex)
{
    return knex.schema.createTable('lore', t=>
    {
        t.increments('id').unsigned().primary();
        t.string('accessor').notNullable().index('accessor');
        t.string('title');
        t.string('description');
        t.string('image');
        t.string('thumbnail');
    });
};

exports.down = function(knex)
{
  return knex.schema.dropTableIfExists('lore');
};
