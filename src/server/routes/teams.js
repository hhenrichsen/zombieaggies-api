const Router = require('koa-router');
const queries = require('../db/queries/teams');

const router = new Router();
const BASE_URL = `/api/v1/teams`;

router.get(BASE_URL, async (ctx) => {
    try {
        const teams = await queries.getAllTeams();
        ctx.body = {
            status: 'Success',
            data: teams
        };
    } catch (err) {
        console.log(err)
    }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const team = await queries.getSingleTeam(ctx.params.id);
        if (team.length) {
            ctx.body = {
                status: 'Success',
                data: team
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'Error',
                message: 'That team does not exist.'
            };
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;