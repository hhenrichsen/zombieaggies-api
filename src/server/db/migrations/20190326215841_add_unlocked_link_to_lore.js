exports.up = function (knex)
{
    knex.table('lore', t =>
    {
        t.boolean('unlocked').notNullable().defaultTo(false);
        t.string('link');
    });
};

exports.down = function (knex)
{
    knex.table('lore', t =>
    {
        t.dropColumns('unlocked', 'link');
    });
};
