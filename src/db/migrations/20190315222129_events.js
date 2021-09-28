exports.up = knex =>
  knex.schema
    .createTable('events', table => {
      table.increments('id')
      table
        .integer('subject')
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('verb').notNullable()
      table.string('target').defaultTo('')
      table.json('info').defaultTo('{}')
      table.timestamps(true, true)
    })
    .then(Promise.resolve())

exports.down = knex => knex.schema.dropTable('events').then(Promise.resolve())
