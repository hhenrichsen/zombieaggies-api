
exports.up = function(knex)
{
  return knex.schema.table('users', t =>
  {
      t.integer('team').references('id').inTable('teams').defaultTo(1);
      t.integer('tags').unsigned().defaultTo(0);
  })
};

exports.down = function(knex)
{
  return knex.schema.table('users', t =>
  {
      t.dropColumns('team', 'tags');
  })
};
