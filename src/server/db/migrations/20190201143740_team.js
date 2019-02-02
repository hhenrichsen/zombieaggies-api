exports.up = (knex, Promise) => {
  return knex.schema.createTable('teams', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.string('color').notNullable().defaultTo('gray');
    table.integer('points').notNullable().defaultTo(0);
    table.boolean('visible').notNullable().defaultTo(true);
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('teams');
};