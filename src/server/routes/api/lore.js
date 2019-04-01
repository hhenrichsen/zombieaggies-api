const Router = require('koa-router');
const lore = require('../../../db/queries/lore');
const logger = require('../../logger');

const router = new Router();

const BASE_URL = `/lore`;

const RateLimit = require('koa2-ratelimit').RateLimit;

const loreRateLimit = RateLimit.middleware({
    interval: 5 * 60 * 1000, // 5 minutes
    max: 5,
    prefixKey: 'lore', // to allow the bdd to Differentiate the endpoint
});

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

router.post(`${BASE_URL}/unlock`, loreRateLimit, async ctx =>
{
    logger.info('Passed accessor');
    if (ctx.isAuthenticated())
    {
        if (ctx.request.body.accessor)
        {
            const item = await lore.unlockByAccessor(ctx.request.body.accessor);
            logger.info(item);
            if (item)
            {
                ctx.body = item;
                ctx.status = 200;
                ctx.redirect('/lore/' + item[0].id);
            }
            else
            {
                ctx.status = 400;
                ctx.redirect('/lore');
            }
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

router.get(`${BASE_URL}/:id`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const item = await lore.get(parseInt(ctx.params.id));
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

module.exports = router;