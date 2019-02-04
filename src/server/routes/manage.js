const Router = require('koa-router');
const locationQueries = require('../db/queries/locations');
const teamQueries = require('../db/queries/teams');

const router = new Router();
const BASE_URL = `/manage`;

router.get(`${BASE_URL}`, async (ctx) => {
    if (ctx.isAuthenticated() && ctx.req.user.access >= 1) {
        const locations = await locationQueries.getAllLocations();
        let teams = await teamQueries.getAllTeams();
        if (ctx.req.user.access < 2) {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }
        if (locations.length) {
            return await ctx.render("manageList.pug", { pageName: "Location Management", teams: teams, locations: locations, user: ctx.req.user });
        }
    }
    ctx.status = 404;
})

router.get(`${BASE_URL}/undoDayTwo`, async (ctx) => {
    if (ctx.isAuthenticated() && ctx.req.user.access >= 2) {
        await teamQueries.updateTeam(3, { visible: false })
    }
    else {
        ctx.status = 404;
        return;
    }
})

router.get(`${BASE_URL}/dayTwo`, async (ctx) => {
    if (ctx.isAuthenticated() && ctx.req.user.access >= 2) {
        await teamQueries.updateTeam(3, { visible: true })
    }
    else {
        ctx.status = 404;
        return;
    }
})

router.get(`${BASE_URL}/resetPoints`, async (ctx) => {
    if (ctx.isAuthenticated() && ctx.req.user.access >= 2) {
        ctx.body = teamQueries.resetPoints();
    }
    else {
        ctx.status = 404;
        return;
    }
})

router.get(`${BASE_URL}/location/:id`, async (ctx) => {
    if (ctx.isAuthenticated() && ctx.req.user.access >= 1) {
        const location = await locationQueries.getSingleLocation(ctx.params.id);
        let teams = await teamQueries.getAllTeams();
        if (ctx.req.user.access < 2) {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }
        if (location.length && teams.length) {
            return await ctx.render("manageOne.pug", { pageName: "Location Management", location: location[0], user: ctx.user, teams: teams });
        }
    }
    ctx.status = 404;
})

module.exports = router;