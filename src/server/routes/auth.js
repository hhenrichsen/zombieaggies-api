const Router = require('koa-router');
const passport = require('koa-passport');
const queries = require('../db/queries/users');
const events = require('../db/queries/events');
const logger = require('../logger');

const RateLimit = require('koa2-ratelimit').RateLimit;

const router = new Router();

const authRateLimit = RateLimit.middleware({
    interval: 5 * 60 * 1000, // 15 minutes
    max: 5,
    prefixKey: 'auth', // to allow the bdd to Differentiate the endpoint
});

router.get('/auth/register', async ctx =>
{
    await ctx.render("auth/register.pug", {csrf: ctx.csrf,});
});

router.post('/auth/register', authRateLimit, async ctx =>
{
    const user = await queries.addUser(ctx.request.body)
        .catch(err =>
        {
            logger.error("DB Error: " + JSON.stringify(err));
            ctx.status = err.statusCode;
            ctx.body = {
                err,
            };
            return Promise.resolve();
        });
    return passport.authenticate('local', (err, user) =>
    {
        if (user)
        {
            logger.info("User " + user.id + " registered.");
            events.addEvent(user.id, "registered.");
            ctx.login(user);
            ctx.redirect('/');
        }
    })(ctx);
});

router.get('/auth/status', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        await ctx.render("auth/status.pug");
    }
    else
    {
        ctx.redirect('/auth/login');
    }
});

router.get('/auth/login', async ctx =>
{
    if (!ctx.isAuthenticated())
    {
        await ctx.render("auth/login.pug", {csrf: ctx.csrf,});
    }
    else
    {
        ctx.redirect('/');
    }
});

router.post('/auth/login', authRateLimit, async ctx =>
    passport.authenticate('local', (err, user) =>
    {
        if (user)
        {
            ctx.login(user);
            ctx.redirect('/');
        }
        else
        {
            ctx.status = 400;
            ctx.body = {
                message: "Invalid username and password combination. Have you registered?",
            }
        }
    })(ctx));

router.get('/auth/logout', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        ctx.logout();
        ctx.redirect('/');
    }
    else
    {
        ctx.body = {success: false,};
        ctx.throw(401);
    }
});

module.exports = router;
