const Code = require("../models/Code");
const OZ = require("../models/OZ");
const User = require("../models/User");
const knex = require('../connection');
const logger = require('../../logger');

async function getIdFromCode(code)
{
    return await Code.query()
                     .select('user')
                     .where('code', '=', code);
}

async function tagUser(actorId, targetId)
{
    if (actorId === targetId)
    {
        let e = new Error("You cannot tag yourself.");
        throw(e);
    }

    // Get both players.
    const actor = await User.query().findById(actorId);
    const target = await User.query().findById(targetId);

    if (actor.team === 1)
    {
        let e = new Error("Humans cannot tag other players.");
        throw(e);
    }

    if (target.team !== 1)
    {
        let e = new Error("Zombies cannot be re-tagged.");
        throw(e);
    }

    target.team = actor.team;
    target.lastFeed = knex.fn.now();
    actor.lastFeed = knex.fn.now();

    actor.tags++;

    await User.query().patchAndFetchById(actorId, actor);
    await User.query().patchAndFetchById(targetId, target);
}

async function feed(id)
{
    await User.query().patchAndFetchById(id, { lastFeed: knex.fn.now(), });
}

async function isOZ(id)
{
    let res = await OZ.query().where('user', id);
    return res.length > 0;
}

async function addOZ(id)
{
    await User.query().patchAndFetchById(id, { title: 'OZ', });

    return await OZ
        .query()
        .insert({ user: id, })
        .returning('*');
}

async function removeOZ(id)
{
    await User.query().patchAndFetchById(id, { title: 'Player', });

    return await OZ
        .query()
        .where('user', id)
        .first()
        .delete()
        .returning('*');
}

module.exports = {
    isOZ,
    getIdFromCode,
    tagUser,
    addOZ,
    removeOZ,
    feed,
};