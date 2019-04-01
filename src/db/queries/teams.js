const Team = require("../models/Team");
const User = require("../models/User");

async function getAllTeams()
{
    return Team.query().orderBy('id');
}

async function getSingleTeam(id)
{
    return await Team.query()
                     .findById(id)
                     .returning('*');
}

async function updateTeam(id, team)
{
    return await Team.query()
                     .patchAndFetchById(id, team)
                     .returning('*');
}

async function resetPoints()
{
    return await Team.query()
                     .where('points', '!=', -1)
                     .patch({points: 0,})
                     .returning('*');
}

async function getPlayerCount(id)
{
    return (await User.query().where('team', id)).length;
}

module.exports = {
    getAllTeams,
    getSingleTeam,
    updateTeam,
    resetPoints,
    getPlayerCount,
};