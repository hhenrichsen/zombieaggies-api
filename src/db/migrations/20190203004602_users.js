exports.up = knex =>
  knex.schema
    .createTable('users', table => {
      table.increments('id')
      table
        .string('username')
        .unique()
        .notNullable() //THIS MEANS EMAIL!
      table.string('password').notNullable()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('title')
      table.string('phone')
      table.string('a_number')
      table
        .boolean('bandanna')
        .defaultTo(false)
        .notNullable()
      table.timestamps(true, true)
    })
    .then(Promise.resolve())

exports.down = knex => knex.schema.dropTable('users').then(Promise.resolve())
