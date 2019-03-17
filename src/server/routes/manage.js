const Router = require('koa-router');
const locationQueries = require('../db/queries/locations');
const teamQueries = require('../db/queries/teams');
const logger = require('../logger');

const router = new Router();
const BASE_URL = `/manage`;

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.accessPointManagement)
    {
        const locations = await locationQueries.getAllLocations();
        let teams = await teamQueries.getAllTeams();
        if (!ctx.req.user.viewHiddenTeams)
        {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }
        if (locations.length)
        {
            return await ctx.render("manageList.pug", {
                pageName: "Location Management",
                teams: teams,
                locations: locations,
                user: ctx.req.user,
                csrf: ctx.csrf,
            });
        }
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/location/:id`, async ctx =>
{
    logger.info('Passed auth');
    if (ctx.isAuthenticated() && ctx.req.user.accessPointManagement)
    {
        const location = await locationQueries.getSingleLocation(ctx.params.id);
        let teams = await teamQueries.getAllTeams();
        if (!ctx.req.user.viewHiddenTeams)
        {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }
        if (location)
        {
            return await ctx.render("manageOne.pug", {
                pageName: "Location Management",
                location: location,
                user: ctx.user,
                teams: teams,
                csrf: ctx.csrf,
            });
        }
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

module.exports = router;