const Router = require('koa-router');
const teams = require('../../../db/queries/teams');
const events = require('../../../db/queries/events');
const users = require('../../../db/queries/users');
const logger = require('../../../server/logger');

const router = new Router();
const BASE_URL = `/admin`;

router.get(`${BASE_URL}/buttons`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user &&
            ctx.req.user.permissions.useAdminRoutes)
        {
            return ctx.render('admin/dash.pug', {
                user: ctx.req.user,
                csrf: ctx.csrf,
            });
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

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user &&
            ctx.req.user.permissions.accessUserManagement)
        {
            return ctx.render('admin/players.pug', {
                user: ctx.req.user,
                csrf: ctx.csrf,
            });
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

router.get(`${BASE_URL}/users/:id`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user &&
            ctx.req.user.permissions.accessUserManagement &&
            ctx.req.user.permissions.useAdminRoutes)
        {
            const player = await users.getUser(parseInt(ctx.params.id));
            const teamList = await teams.getAllTeams();

            if (player)
            {
                return ctx.render('admin/managePlayer.pug', {
                    player: player,
                    teams: teamList,
                    user: ctx.req.user,
                    csrf: ctx.csrf,
                });
            }
            else
            {
                ctx.status = 404;
                return Promise.resolve();
            }
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

router.get(`${BASE_URL}/undoDayTwo`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.useAdminRoutes)
        {
            events.addEvent(ctx.req.user.id, "undid day two.");
            const result1 = await teams.updateTeam(3, { visible: false, });
            const result2 = await teams.updateTeam(2, { name: 'Zombies', });
            ctx.status = 200;
            ctx.body = {
                ...[ result1, result2, ],
            };
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

router.get(`${BASE_URL}/dayTwo`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.useAdminRoutes)
        {
            events.addEvent(ctx.req.user.id, "activated day two.");
            const result = await teams.updateTeam(3, { visible: true, });
            const result2 = await teams.updateTeam(2, { name: 'Plague Zombies', });
            ctx.status = 200;
            ctx.body = {
                ...[ result, result2, ],
            };
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

router.get(`${BASE_URL}/resetPoints`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.useAdminRoutes)
        {
            events.addEvent(ctx.req.user.id, "reset points.");
            const result = await teams.resetPoints();
            ctx.status = 200;
            ctx.body = {
                data: result,
            };
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


router.get(`${BASE_URL}/resetPoints`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.useAdminRoutes)
        {
            events.addEvent(ctx.req.user.id, "reset points.");
            const result = await teams.resetPoints();
            ctx.status = 200;
            ctx.body = {
                data: result,
            };
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

router.get(`${BASE_URL}/emailList/:id`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.useAdminRoutes)
        {
            let id = parseInt(ctx.params.id);
            let result = (await users.getEmailList(parseInt(ctx.params.id)));
            logger.info(result);
            if (id === 1)
            {
                let ozs = await users.getOZs();
                ozs.forEach(i => result.push(i[0]));
            }
            if (result.length > 0)
            {
                result = result
                    .map(i => i.username)
                    .join("; ");
                logger.info(result);
            }
            ctx.status = 200;
            ctx.body = result;
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