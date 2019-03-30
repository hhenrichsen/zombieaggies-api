const logger = require('../../logger');

const Router = require('koa-router');
const users = require('../../../db/queries/users');

const router = new Router();
const BASE_URL = `/@me`;

router.get(BASE_URL, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const result = await users.getUser(ctx.req.user.id);
        delete result['permissions'];
        ctx.body = {
            ...result,
        };
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

router.post(`${BASE_URL}/nickname`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.request.body.nickname)
        {
            const result = await users.setNickname(ctx.req.user.id, ctx.request.body.nickname);
            delete result['permissions'];
            ctx.body = {
                ...result,
            };
            return Promise.resolve();
        }
        else
        {
            ctx.status = 400;
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