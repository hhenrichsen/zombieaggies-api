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
        result.code = result.code.code;
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

router.get(`${BASE_URL}/tos-agree`, async ctx => 
{
    if (ctx.isAuthenticated())
    {
        try 
        {
            const result = await users.updateUser(ctx.req.user.id, { tosAgree: true });
            if(result) 
            {
                ctx.status = 200;
                ctx.redirect("/auth/status");
                return Promise.resolve();
            }
            else 
            {
                ctx.status = 500;
                return Promise.resolve();
            }
        }
        catch (e) 
        {
            ctx.status = 500;
            return Promise.resolve();
        }
    }
    else 
    {
        ctx.status = 401;
        return Promise.resolve();
    }
})

router.get(`${BASE_URL}/activate`, async ctx => 
{
    if (ctx.isAuthenticated())
    {
        try 
        {
            const result = await users.updateUser(ctx.req.user.id, { active: true, team: 1, });
            const result2 = await users.generateCode(ctx.req.user.id);
            if(result && result2) 
            {
                ctx.status = 200;
                ctx.redirect("/start/active");
                return Promise.resolve();
            }
            else 
            {
                ctx.status = 500;
                return Promise.resolve();
            }
        }
        catch (e) 
        {
            ctx.status = 500;
            return Promise.resolve();
        }
    }
    else 
    {
        ctx.status = 401;
        return Promise.resolve();
    }
})

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
            return ctx.redirect('/auth/status');
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
