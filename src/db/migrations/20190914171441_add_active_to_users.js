exports.up = function(knex) {
    return knex.schema.table('users', t => {
        t.boolean('active').defaultTo('false').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', t => {
        t.dropColumn('active');
    })
};
