const knex = require('../connections');

function getAllTeams() {
    return knex('teams').where({
            visible: true
        })
        .select('id', 'name', 'color', 'points');
}

function getSingleTeam(id) {
    return knex('teams').where({
            visible: true,
            id: parseInt(id),
        })
        .select('id', 'name', 'color', 'points');
}

module.exports = {
    getAllTeams,
    getSingleTeam
};