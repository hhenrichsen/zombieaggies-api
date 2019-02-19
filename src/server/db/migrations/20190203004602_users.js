exports.up = (knex, Promise) => {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('firstname');
        table.string('lastname');
        table.string('title');
        table.string('username').unique().notNullable();
        table.string('password').notNullable();
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('users');
};
