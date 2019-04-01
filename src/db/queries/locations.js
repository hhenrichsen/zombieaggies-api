const knex = require('../connection');
const Location = require("../models/Location");

async function getAllLocations()
{
    return await Location.query().orderBy('id');
}

async function getSingleLocation(id)
{
    return await Location
        .query()
        .findById(id)
        .returning('*');
}

async function updateLocation(id, location)
{
    return await Location.query()
        .patchAndFetchById(id, location);
}


module.exports = {
    getAllLocations,
    getSingleLocation,
    updateLocation,
};