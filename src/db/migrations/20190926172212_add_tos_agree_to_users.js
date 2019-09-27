
exports.up = function(knex) {
    return knex.schema.table('users', table => {
        table.boolean('tos_agree').defaultTo(false).notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', table => {
        table.dropColumn('tos_agree');
    });
};
