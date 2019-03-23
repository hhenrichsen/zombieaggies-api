const logger = require("../../logger");
const Event = require("../models/Event");

async function addEvent(userId, verb, target = "", info = {})
{
    logger.silly("Creating Event " + userId + " " + verb + " " + target);
    return await Event.query()
        .insert({
            subject: userId,
            verb: verb,
            target: target,
            info: info,
        })
        .returning('*');
}

module.exports = {
    addEvent,
};