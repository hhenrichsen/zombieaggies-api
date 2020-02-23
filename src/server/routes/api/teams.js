const logger = require('../../logger');

const Router = require('koa-router');
const queries = require('../../../db/queries/teams');

const router = new Router();
const BASE_URL = `/teams`;

router.get(BASE_URL, async ctx =>
{
    try
    {
        let teams = await queries.getAllTeams();

        if (!ctx.isAuthenticated() ||
            (ctx.req.user && !ctx.req.user.permissions.viewHiddenTeams))
        {
            teams = teams.filter(i => i.visible);
            teams.forEach(i => delete i["visible"]);
        }

        await Promise.all(teams.map(async i =>
        {
            i.players = await queries.getPlayerCount(i.id);
            return i;
        })).then(teams =>
        {
            ctx.body = {
                ...teams,
            };
        });

    }
    catch (err)
    {
        logger.error(err)
    }
});

router.get(`${BASE_URL}/:id`, async ctx =>
{
    try
    {
        let team = await queries.getSingleTeam(ctx.params.id);

        if (team)
        {
            if (team.visible)
            {
                if (!ctx.isAuthenticated() ||
                    (ctx.req.user && !ctx.req.user.permissions.viewHiddenTeams)) {
                    delete team['visible'];
                }

                team.players = await queries.getPlayerCount(ctx.params.id);
                
                ctx.body = {
                    ...team,
                };
                return;
            }
            else if (ctx.req.user &&
                ctx.req.user.permissions.viewHiddenTeams)
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