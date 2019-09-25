
exports.up = function(knex) {
    return knex.schema.table('users', t => {
        t.string('password_reset_token').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.table('users', t => {
        t.dropColumn('password_reset_token');
    });
};
