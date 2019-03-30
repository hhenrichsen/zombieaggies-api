const Router = require('koa-router');
const locationQueries = require('../../../db/queries/locations');
const teamQueries = require('../../../db/queries/teams');

const router = new Router();
const BASE_URL = `/manage`;

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.accessPointManagement)
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
                return await ctx.render("manage/manageList.pug", {
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
            ctx.status = 403;
            return Promise.resolve();
        }
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/location/:id`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.accessPointManagement)
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
                return await ctx.render("manage/manageOne.pug", {
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
            ctx.status = 403;
            return Promise.resolve();
        }
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

module.exports = router;