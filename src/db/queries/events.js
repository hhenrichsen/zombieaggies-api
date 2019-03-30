const logger = require("../../server/logger");
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

async function getEvents()
{
    return await Event.query();
}

async function getEventsFromUser(id)
{
    return await Event.query().where('subject', id);
}

async function getEventsFromVerb(verb)
{
    return await Event.query().where('verb', 'like', `%${verb}%`);
}

module.exports = {
    addEvent,
    getEvents,
    getEventsFromUser,
    getEventsFromVerb,
};