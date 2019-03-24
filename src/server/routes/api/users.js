const logger = require('../../logger');

const users = require('../../db/queries/users');
const events = require('../../db/queries/events');

const Router = require('koa-router');

const router = new Router();
const BASE_URL = `/api/v1/users`;

router.get(`${BASE_URL}/:id`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.accessUserManagement)
    {
        const result = await users.getUser(ctx.params.id);
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

router.get(`${BASE_URL}/:id/moderator`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.useAdminRoutes &&
        ctx.req.user.permissions.accessUserManagement)
    {
        // if (ctx.req.user.id === parseInt(ctx.params.id))
        // {
        //     ctx.status = 400;
        //     ctx.body = {
        //         message: "You cannot promote yourself.",
        //     };
        //     return Promise.resolve();
        // }

        const user = await users.getUser(ctx.params.id);
        users.makeModerator(ctx.params.id);

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

router.get(`${BASE_URL}/:id/demote`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.useAdminRoutes &&
        ctx.req.user.permissions.accessUserManagement)
    {
        // if (ctx.req.user.id === parseInt(ctx.params.id))
        // {
        //     ctx.status = 400;
        //     ctx.body = {
        //         message: "You cannot demote yourself.",
        //     };
        //     return Promise.resolve();
        // }

        const user = await users.getUser(ctx.params.id);
        users.demote(ctx.params.id);

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

router.get(`${BASE_URL}/:id/delete`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.useAdminRoutes &&
        ctx.req.user.permissions.accessUserManagement)
    {
        if (ctx.req.user.id === parseInt(ctx.params.id))
        {
            ctx.status = 400;
            ctx.body = {
                message: "You cannot delete yourself.",
            };
            return Promise.resolve();
        }

        const user = await users.getUser(ctx.params.id);
        users.deleteUser(ctx.params.id);

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

router.get(`${BASE_URL}/:id/toggleBandanna`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.useAdminRoutes &&
        ctx.req.user.permissions.accessUserManagement)
    {
        const result = users.toggleBandanna(ctx.params.id);
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

router.get(`${BASE_URL}/:id/regenCode`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.useAdminRoutes &&
        ctx.req.user.permissions.accessUserManagement)
    {
        const result = await users.generateCode(parseInt(ctx.params.id));
        if (result === undefined)
        {
            ctx.status = 404;
            return Promise.resolve();
        }
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

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.accessUserManagement)
    {
        try
        {
            const result = await users.getAllUsers();
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