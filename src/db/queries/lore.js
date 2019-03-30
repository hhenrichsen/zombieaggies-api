const Lore = require('../models/Lore');

let getAll = function ()
{
    return Lore.query();
};

let getAllUnlocked = function ()
{
    return Lore.query().where('unlocked', true);
};

let get = function (id)
{
    return Lore.query().where('unlocked', true).where('id', id).first();
};

let unlockByAccessor = function (accessor)
{
    return Lore
        .query()
        .where('accessor', accessor)
        .update({ unlocked: true, })
        .returning('*');
};

let add = function (data)
{
    return Lore
        .query()
        .insert(data)
        .returning('*');
};

module.exports = {
    getAll,
    getAllUnlocked,
    get,
    unlockByAccessor,
    add,
};