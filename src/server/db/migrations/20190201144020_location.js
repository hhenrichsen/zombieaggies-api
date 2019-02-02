exports.up = (knex, Promise) => {
    return knex.schema.createTable('locations', (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table.string('location').notNullable();
      table.decimal('lat', 9, 6).notNullable();
      table.decimal('long', 9, 6).notNullable();
      table.integer('owner').references('id').inTable('teams').defaultTo(0).notNullable();
      table.boolean('active').notNullable().defaultTo(true);
    });
  };
  
  exports.down = (knex, Promise) => {
    return knex.schema.dropTable('locations');
  };
  