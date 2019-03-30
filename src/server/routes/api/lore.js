const Router = require('koa-router');
const lore = require('../../../db/queries/lore');

const router = new Router();

const BASE_URL = `/lore`;

router.get(BASE_URL, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const item = await lore.getAllUnlocked();
        ctx.body = item;
        ctx.status = 200;
        return Promise.resolve();
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/:id`, ctx =>
{
    if (ctx.isAuthenticated())
    {
        const item = lore.get(parseInt(ctx.params.id));
        if (item)
        {
            ctx.body = item;
            ctx.status = 200;
            return Promise.resolve();
        }
        else
        {
            ctx.status = 404;
            return Promise.resolve();
        }
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

router.post(`${BASE_URL}`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.req.user.permissions.useAdminRoutes || ctx.req.user.permissions.accessLore)
        {
            const lore = await lore.add(ctx.request.body);
            ctx.status = 200;
            ctx.body = {
                ...lore,
            };
        }
        else
        {
            this.status = 403;
            return Promise.resolve();
        }
    }
    else
    {
        this.status = 401;
        return Promise.resolve();
    }
});

router.get(`${BASE_URL}/unlock/:accessor`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const item = lore.unlockByAccessor(ctx.params.accessor);
        if (item)
        {
            ctx.body = item;
            ctx.status = 200;
            ctx.redirect('/lore');
        }
        else
        {
            ctx.status = 400;
        }
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

module.exports = router;