exports.up = function (knex)
{
    return knex.schema.table('lore', t =>
    {
        t.text('description').alter();
    });
};

exports.down = function (knex)
{
    return knex.schema.table('lore', t =>
    {
        t.string('description').alter();
    });
};
