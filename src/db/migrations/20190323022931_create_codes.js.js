exports.up = function (knex) {
  return Promise.all([
    knex.schema.table('users', t => {
      t.dropColumn('code')
    }),
    knex.schema.createTable('codes', t => {
      t.increments('id').unsigned()
      t.integer('user')
        .references('id')
        .inTable('users')
        .notNullable()
        .onDelete('CASCADE')
      t.string('code')
        .notNullable()
        .unique()
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.table('users', t => {
      t.string('code')
        .nullable()
        .index('code')
    }),
    knex.schema.dropTable('codes')
  ])
}
