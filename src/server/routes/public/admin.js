const Router = require('koa-router');
const teamQueries = require('../../db/queries/teams');
const events = require('../../db/queries/events');

const router = new Router();
const BASE_URL = `/admin`;

router.get(`${BASE_URL}/buttons`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user && ctx.req.user.permissions.useAdminRoutes)
    {
        return ctx.render('admin/dash.pug', {});
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user && ctx.req.user.permissions.accessUserManagement)
    {
        return ctx.render('admin/players.pug', {});
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/undoDayTwo`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.permissions.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, "undid day two.");
        const result1 = await teamQueries.updateTeam(3, { visible: false, });
        const result2 = await teamQueries.updateTeam(2, { name: 'Zombies', });
        ctx.status = 200;
        ctx.body = {
            ...[ result1, result2, ],
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/dayTwo`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.permissions.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, "activated day two.");
        const result = await teamQueries.updateTeam(3, { visible: true, });
        const result2 = await teamQueries.updateTeam(2, { name: 'Plague Zombies', });
        ctx.status = 200;
        ctx.body = {
            ...[ result, result2, ],
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/resetPoints`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.permissions.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, "reset points.");
        const result = await teamQueries.resetPoints();
        ctx.status = 200;
        ctx.body = {
            data: result,
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});


router.get(`${BASE_URL}/resetPoints`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.permissions.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, "reset points.");
        const result = await teamQueries.resetPoints();
        ctx.status = 200;
        ctx.body = {
            data: result,
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

module.exports = router;