const knex = require('../connection');

function getAllTeams() {
    return knex('teams')
        .select('*').orderBy('id');
}

function getSingleTeam(id) {
    return knex('teams').where({
        id: parseInt(id),
    })
        .select('*').first();
}

function updateTeam(id, team) {
    const data = team;
    return knex('teams')
        .where({ id: parseInt(id) })
        .update(data)
        .returning('*');
}

function resetPoints() {
    const data = { points: 0 };
    return knex('teams').where('points', '>', 0).update(data).returning('*');
}

module.exports = {
    getAllTeams,
    getSingleTeam,
    updateTeam,
    resetPoints
};