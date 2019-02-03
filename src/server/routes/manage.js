const Router = require('koa-router');
const locationQueries = require('../db/queries/locations');
const teamQueries = require('../db/queries/teams');

const router = new Router();

router.get(`/manage`, async (ctx) => {
    if (ctx.isAuthenticated() && ctx.req.user.access >= 1) {
        const locations = await locationQueries.getAllLocations();
        if (locations.length) {
            return await ctx.render("manageList.pug", { pageName: "Location Management", locations: locations, user: ctx.user });
        }
    }
    ctx.status = 404;
})

router.get(`/manage/:id`, async (ctx) => {
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