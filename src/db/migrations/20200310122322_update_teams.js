
exports.up = async function(knex, Promise) {
    return knex.schema.table('teams', table => {
        table.boolean('default').default(false);
        table.string('channel_id', 19).default('000000000000000000');
    });
};

exports.down = async function(knex, Promise) {
    return knex.schema.table('teams', table => {
        table.dropColumn('default');
        table.dropColumn('channel_id');
    });
};
