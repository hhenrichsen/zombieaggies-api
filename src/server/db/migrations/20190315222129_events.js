exports.up = (knex, Promise) =>
    knex.schema.createTable('events', table =>
    {
        table.increments('id');
        table.integer('subject').references('id').inTable('users').onDelete('SET NULL');
        table.string('verb').notNullable();
        table.string('target').defaultTo("");
        table.json('info').defaultTo("{}");
        table.timestamps(true, true);
    }).then(Promise.resolve());

exports.down = (knex, Promise) =>
    knex.schema.dropTable('events').then(Promise.resolve());
