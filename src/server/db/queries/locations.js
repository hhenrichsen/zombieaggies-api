const knex = require('../connection');

function getAllLocations() {
    return knex('locations').select('*');
}

function getSingleLocation(id) {
    return knex('locations').where({
        id: parseInt(id),
    })
        .select('*').first();
}

function getSingleSmallLocation(id) {
    return knex('locations').where({
        id: parseInt(id),
    })
        .select('id', 'active', 'owner').first();
}

function updateLocation(id, location) {
    const data = location;
    return knex('locations')
        .where({ id: parseInt(id) })
        .update(data)
        .returning('*');
}


module.exports = {
    getAllLocations,
    getSingleLocation,
    getSingleSmallLocation,
    updateLocation
};