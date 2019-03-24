const logger = require('../../logger');

const users = require('../../db/queries/users');
const events = require('../../db/queries/events');
const tags = require('../../db/queries/tags');

const Router = require('koa-router');

const router = new Router();
const BASE_URL = `/users`;

let cleanUserBasedOnPermissions = async function (user, permissions)
{
    let toReturn = { ...user, };
    if (!permissions.accessUserManagement)
    {
        delete toReturn['email'];
        delete toReturn['id'];
        delete toReturn['phone'];
        delete toReturn['aNumber'];
        delete toReturn['bandanna'];
        delete toReturn['permissions'];
        delete toReturn['code'];
    }
    if (!permissions.viewOZ)
    {
        if (await tags.isOZ(user.id))
        {
            toReturn.tags = 0;
            toReturn.team = 1;
            toReturn.title = "Player";
        }
    }
    return toReturn;
};

router.get(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        try
        {
            const result = await users.getAllUsers();

            const revised = result.map(async i => await cleanUserBasedOnPermissions(i, ctx.req.user.permissions));
            await Promise.all(revised).then(revised =>
            {
                ctx.status = 200;
                ctx.body = {
                    ...revised,
                };
            });
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

router.get(`${BASE_URL}/:id`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const result = await users.getUser(ctx.params.id);

        ctx.status = 200;
        ctx.body = {
            ...await cleanUserBasedOnPermissions(result, ctx.req.user.permissions),
        };
        return Promise.resolve();
    }
    else
    {
        ctx.status = 404;
        return Promise.resolve();
    }
});

router.patch(`${BASE_URL}/:id`, async ctx =>
{
    if (ctx.isAuthenticated() &&
        ctx.req.user.permissions.accessUserManagement &&
        ctx.req.user.permissions.useAdminRoutes)
    {
        try
        {
            users.updateUser(ctx.params.id, ctx.request.body);
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

// router.get(`${BASE_URL}/:id/moderator`, async ctx =>
// {
//     if (ctx.isAuthenticated() &&
//         ctx.req.user.permissions.useAdminRoutes &&
//         ctx.req.user.permissions.accessUserManagement)
//     {
//         // if (ctx.req.user.id === parseInt(ctx.params.id))
//         // {
//         //     ctx.status = 400;
//         //     ctx.body = {
//         //         message: "You cannot promote yourself.",
//         //     };
//         //     return Promise.resolve();
//         // }
//
//         const user = await users.getUser(ctx.params.id);
//         users.makeModerator(ctx.params.id);
//
//         events.addEvent(ctx.req.user.id, "promoted", ctx.params.id);
//         logger.info(`${ctx.req.user.firstname} ${ctx.req.user.lastname} promoted user ${user.firstname} ${user.lastname} to Moderator`);
//
//         ctx.status = 200;
//         ctx.body = {
//             message: "Success!",
//         };
//         return Promise.resolve();
//     }
//     else
//     {
//         ctx.status = 404;
//         return Promise.resolve();
//     }
// });

router.del(`${BASE_URL}/:id`, async ctx =>
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

// router.get(`${BASE_URL}/:id/toggleBandanna`, async ctx =>
// {
//     if (ctx.isAuthenticated() &&
//         ctx.req.user.permissions.useAdminRoutes &&
//         ctx.req.user.permissions.accessUserManagement)
//     {
//         const result = users.toggleBandanna(ctx.params.id);
//         ctx.status = 200;
//         ctx.body = {
//             ...result,
//         };
//         return Promise.resolve();
//     }
//     else
//     {
//         ctx.status = 404;
//         return Promise.resolve();
//     }
// });

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

module.exports = router;