const logger = require('../logger');

const Router = require('koa-router');
const queries = require('../db/queries/teams');

const router = new Router();
const BASE_URL = `/api/v1/teams`;

router.get(BASE_URL, async ctx =>
{
    try
    {
        let teams = await queries.getAllTeams();

        if (!ctx.isAuthenticated() || (ctx.req.user && !ctx.req.user.viewHiddenTeams))
        {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }

        ctx.body = {
            ...teams,
        };
    } catch (err)
    {
        logger.error(err)
    }
});

router.get(`${BASE_URL}/:id`, async ctx =>
{
    try
    {
        const team = await queries.getSingleTeam(ctx.params.id);

        if (team)
        {
            if(team.visible)
            {
                if(ctx.req.user && !ctx.req.user.viewHiddenTeams)
                {
                    delete team['visible'];
                }

                ctx.body = {
                    ...team,
                };
                return;
            }
            else if (ctx.req.user && ctx.req.user.viewHiddenTeams)
            {
                ctx.body = {
                    ...team,
                };
                return;
            }
        }

        ctx.status = 404;
        ctx.body = {
            message: 'That team does not exist.',
        };
    }
    catch (err)
    {
        logger.error(err)
    }
});

module.exports = router;