const logger = require("../../logger");
const knex = require('../connection');

function addEvent(userId, verb, target = "", info = {})
{
    logger.silly("Creating Event " + userId + " " + verb + " " + target);
    return knex('events')
        .insert({
            subject: userId,
            verb: verb,
            target: target,
            info: info,
        })
        .catch(e => logger.error(e));
}

module.exports = {
    addEvent,
};