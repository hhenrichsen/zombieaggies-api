const knex = require('../connections');

function getAllLocations() {
    return knex('locations').select('*');
}

function getSingleLocation(id) {
    return knex('locations').where({
            id: parseInt(id),
        })
        .select('*');
}

module.exports = {
    getAllLocations,
    getSingleLocation
};