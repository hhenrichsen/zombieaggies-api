const Router = require('koa-router');
const locationQueries = require('../db/queries/locations');
const teamQueries = require('../db/queries/teams');

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
    }
    ctx.status = 404;
    return Promise.resolve();
});

router.get(`${BASE_URL}/undoDayTwo`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        const result = await teamQueries.updateTeam(3, {visible: false,});
        ctx.status = 200;
        ctx.body = {
            data: result,
        }
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/dayTwo`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        const result = await teamQueries.updateTeam(3, {visible: true,});
        ctx.status = 200;
        ctx.body = {
            data: result,
        }
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/resetPoints`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        const result = await teamQueries.resetPoints();
        ctx.status = 200;
        ctx.body = {
            data: result,
        }
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/location/:id`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        const location = await locationQueries.getSingleLocation(ctx.params.id);
        let teams = await teamQueries.getAllTeams();
        if (ctx.req.user.access < 2)
        {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }
        if (location.length && teams.length)
        {
            return await ctx.render("manageOne.pug", {
                pageName: "Location Management",
                location: location[0],
                user: ctx.user,
                teams: teams,
                csrf: ctx.csrf,
            });
        }
    }
    ctx.status = 404;
    return Promise.resolve();
});

module.exports = router;