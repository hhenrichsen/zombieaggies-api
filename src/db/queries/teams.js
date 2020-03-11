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

/**
 * @returns {Promise<Map<String, String>>} A map of team ids to channel ids.
 */
async function getDiscordChannels() {
    const res = await Team.query().select('id', 'channel_id').whereNot({'channel_id': '000000000000000000'});
    const map = new Map();
    for(const team of res) {
        map.set(team['channel_id'], team['id']);
    }
    return map;
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
    return (await User.query().where('team', id).where('active', true)).length;
}

module.exports = {
    getAllTeams,
    getSingleTeam,
    updateTeam,
    resetPoints,
    getPlayerCount,
    getDiscordChannels
};