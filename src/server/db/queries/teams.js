const knex = require('../connection');

function getAllTeams() {
    return knex('teams')
        .select('*').orderBy('id');
}

function getSingleTeam(id) {
    return knex('teams').where({
        id: parseInt(id),
    })
        .select('*');
}

module.exports = {
    getAllTeams,
    getSingleTeam
};