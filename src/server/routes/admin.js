const Router = require('koa-router');
const teamQueries = require('../db/queries/teams');
const userQueries = require('../db/queries/users');
const events = require('../db/queries/events');
const logger = require('../logger');

const router = new Router();
const BASE_URL = `/admin`;

router.get(`${BASE_URL}/buttons`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user && ctx.req.user.useAdminRoutes)
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
    if (ctx.isAuthenticated() && ctx.req.user && ctx.req.user.accessUserManagement)
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
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
    {
        events.addEvent(ctx.req.user.id, "undid day two.");
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
        events.addEvent(ctx.req.user.id, "activated day two.");
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
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes)
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


router.get(`${BASE_URL}/users/:id`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.accessUserManagement)
    {
        const result = await userQueries.getUser(ctx.params.id);
        ctx.status = 200;
        ctx.body = {
            ...result,
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
        // if (ctx.req.user.id === parseInt(ctx.params.id))
        // {
        //     ctx.status = 400;
        //     ctx.body = {
        //         message: "You cannot promote yourself.",
        //     };
        //     return Promise.resolve();
        // }

        const user = await userQueries.getUser(ctx.params.id);
        userQueries.makeModerator(ctx.params.id);

        events.addEvent(ctx.req.user.id, "promoted", ctx.params.id);
        logger.info(`${ctx.req.user.firstname} ${ctx.req.user.lastname} promoted user ${user.firstname} ${user.lastname} to Moderator`);

        ctx.status = 200;
        ctx.body = {
            message: "Success!",
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/users/:id/demote`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes && ctx.req.user.accessUserManagement)
    {
        // if (ctx.req.user.id === parseInt(ctx.params.id))
        // {
        //     ctx.status = 400;
        //     ctx.body = {
        //         message: "You cannot demote yourself.",
        //     };
        //     return Promise.resolve();
        // }

        const user = await userQueries.getUser(ctx.params.id);
        userQueries.demote(ctx.params.id);

        logger.info(JSON.stringify(user));
        events.addEvent(ctx.req.user.id, "demoted", ctx.params.id);
        logger.info(`${ctx.req.user.firstname} ${ctx.req.user.lastname} demoted user ${user.firstname} ${user.lastname}.`);

        ctx.status = 200;
        ctx.body = {
            message: "Success!",
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/users/:id/delete`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes && ctx.req.user.accessUserManagement)
    {
        if (ctx.req.user.id === parseInt(ctx.params.id))
        {
            ctx.status = 400;
            ctx.body = {
                message: "You cannot delete yourself.",
            };
            return Promise.resolve();
        }

        const user = await userQueries.getUser(ctx.params.id);
        userQueries.deleteUser(ctx.params.id);

        events.addEvent(ctx.req.user.id, "deleted", ctx.params.id);
        logger.info(`${ctx.req.user.firstname} ${ctx.req.user.lastname} deleted ${user.firstname} ${user.lastname}.`);

        ctx.status = 200;
        ctx.body = {
            message: "Success!",
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/users/:id/toggleBandanna`, async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.useAdminRoutes && ctx.req.user.accessUserManagement)
    {
        const result = userQueries.toggleBandanna(ctx.params.id);
        ctx.status = 200;
        ctx.body = {
            ...result,
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
    if (ctx.isAuthenticated() && ctx.req.user.accessUserManagement)
    {
        try
        {
            const result = await userQueries.getAllUsers();
            ctx.status = 200;
            ctx.body = {
                ...result,
            };
            return Promise.resolve();
        }
        catch (err)
        {
            logger.error(err);
            return Promise.reject(err);
        }
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }

});

module.exports = router;