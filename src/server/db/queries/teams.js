const Teams = require("../models/Team");

async function getAllTeams()
{
    return Teams.query();
}

async function getSingleTeam(id)
{
    return await Teams.query()
        .findById(id)
        .returning('*');
}

async function updateTeam(id, team)
{
    return await Teams.query()
        .patchAndFetchById(id, team)
        .returning('*');
}

async function resetPoints()
{
    return await Teams.query()
        .where('points', '!=', -1)
        .patch({points: 0,})
        .returning('*');
}

module.exports = {
    getAllTeams,
    getSingleTeam,
    updateTeam,
    resetPoints,
};