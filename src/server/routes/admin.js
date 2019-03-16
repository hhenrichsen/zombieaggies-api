const Router = require('koa-router');
const teamQueries = require('../db/queries/teams');
const userQueries = require('../db/queries/users');
const events = require('../db/queries/events');
const logger = require('../logger');

const router = new Router();
const BASE_URL = `/admin`;

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        ctx.render('admin/dash.pug');
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/users/:id`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes && ctx.req.user.accessUserManagement)
    {
        const result = await userQueries.getUser(ctx.req.id);
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

router.get(`${BASE_URL}/users/:id/moderator`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes && ctx.req.user.accessUserManagement)
    {
        const result = await userQueries.makeModerator(ctx.req.id);
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

router.get(`${BASE_URL}/users`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes && ctx.req.user.accessUserManagement)
    {
        try
        {
            const result = await userQueries.listUsers();
            ctx.status = 200;
            ctx.body = {
                data: result,
            };
            return Promise.resolve();
        } catch (err)
        {
            logger.error(err)
        }
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }

});

router.get(`${BASE_URL}/undoDayTwo`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, " undid day two.");
        const result = await teamQueries.updateTeam(3, {visible: false,});
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

router.get(`${BASE_URL}/dayTwo`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, " activated day two.");
        const result = await teamQueries.updateTeam(3, {visible: true,});
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
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, " reset points.");
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