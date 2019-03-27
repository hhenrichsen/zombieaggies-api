exports.up = function (knex)
{
    return knex.table('lore', t =>
    {
        t.boolean('unlocked').notNullable().defaultTo(false);
        t.string('link');
    });
};

exports.down = function (knex)
{
    return knex.table('lore', t =>
    {
        t.dropColumns('unlocked', 'link');
    });
};
