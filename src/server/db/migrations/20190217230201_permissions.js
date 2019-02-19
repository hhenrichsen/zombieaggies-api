exports.up = (knex, Promise) => {
    return knex.schema.createTable('permissions', (table) => {
        table.increments('id');
        table.integer('user').references('id').inTable('users').notNullable();
        table.boolean('viewHiddenTeams').defaultTo(false);
        table.boolean('accessPointManagement').defaultTo(false);
        table.boolean('useAdminRoutes').defaultTo(false);
        table.boolean('accessUserManagement').defaultTo(false);
    });
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('permissions');
};
