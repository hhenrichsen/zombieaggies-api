const logger = require('../../logger');

const users = require('../../db/queries/users');
const events = require('../../db/queries/events');

const RateLimit = require('koa2-ratelimit').RateLimit;

const Router = require('koa-router');

const tagRateLimit = RateLimit.middleware({
    interval: 5 * 60 * 1000, // 5 minutes
    max: 5,
    prefixKey: 'tags', // to allow the bdd to Differentiate the endpoint
});

const router = new Router();
const BASE_URL = `/tags`;

router.get(`${BASE_URL}/add`, tagRateLimit, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.query.code !== undefined)
        {
            let id = await users.getIdFromCode(ctx.query.code);
            if (id.length === 1)
            {
                return await users
                    .tagUser(ctx.req.user.id, id[0].user)
                    .then(async () =>
                    {
                        await events.addEvent(ctx.req.user.id, " tagged ", id[0].user, { team: ctx.req.user.team, });
                        ctx.status = 200;
                        ctx.body = 'Success!';
                        return Promise.resolve();
                    })
                    .catch(err =>
                    {
                        ctx.status = 400;
                        ctx.body = err.message;
                        return Promise.resolve();
                    });
            }
            else
            {
                ctx.status = 400;
                ctx.body = 'Invalid code.';
                return Promise.resolve();
            }
        }
        else
        {
            ctx.status = 400;
            ctx.body = 'Parameter `code` is required.';
            return Promise.resolve();
        }
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

router.post(`${BASE_URL}/add`, tagRateLimit, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (ctx.request.body.code !== undefined)
        {
            let id = await users.getIdFromCode(ctx.request.body.code);
            if (id.length === 1)
            {
                return await users.tagUser(ctx.req.user.id, id[0].user)
                                  .then(() =>
                                  {
                                      ctx.status = 200;
                                      return Promise.resolve();
                                  })
                                  .catch(err =>
                                  {
                                      ctx.status = 400;
                                      ctx.body = err;
                                      return Promise.resolve();
                                  });
            }
            else
            {
                ctx.status = 400;
                ctx.body = {
                    message: 'Invalid code.',
                };
                return Promise.resolve();
            }
        }
        else
        {
            ctx.status = 400;
            ctx.body = {
                message: 'Property `code` is required.',
            };
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