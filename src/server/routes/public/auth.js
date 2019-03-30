const Router = require('koa-router');
const passport = require('koa-passport');
const queries = require('../../../db/queries/users');
const events = require('../../../db/queries/events');
const logger = require('../../logger');
const btoa = require('btoa');
const fetch = require('node-fetch');

const RateLimit = require('koa2-ratelimit').RateLimit;

const router = new Router();

const authRateLimit = RateLimit.middleware({
    interval: 5 * 60 * 1000, // 15 minutes
    max: 5,
    prefixKey: 'auth', // to allow the bdd to Differentiate the endpoint
});

router.get('/auth/register', async ctx =>
{
    await ctx.render("auth/register.pug", {
        csrf: ctx.csrf,
        error: ctx.request.query.error,
    });
});

router.post('/auth/register', authRateLimit, async ctx =>
{
    if (ctx.request.body.phone)
    {
        ctx.request.body.phone = ctx.request.body.phone.replace(/\D/g, "");
    }
    ctx.request.body.username = ctx.request.body.username.toLowerCase();

    if (ctx.request.body.password === null || ctx.request.body.password === undefined)
    {
        return ctx.redirect('/auth/register?error=Password is required%2E');
    }
    return queries.addUser(ctx.request.body)
                  .then(() =>
                      passport.authenticate('local', (err, user) =>
                      {
                          if (user)
                          {
                              logger.info("User " + user.id + " registered.");
                              events.addEvent(user.id, "registered.");
                              ctx.login(user);
                              return ctx.redirect('/');
                          }
                          else
                          {
                              return ctx.redirect('/auth/register?error=A user with that email already exists%2E');
                          }
                      })(ctx))
                  .catch(err =>
                  {
                      logger.error("DB Error: " + JSON.stringify(err));
                      let msg = Object.keys(err.data)
                                      .reduce((a, i) =>
                                          a + i.replace("aNumber", "A Number")
                                               .replace("phone", "Phone Number")
                                               .replace("username", "Email") + ", ",
                                          "Invalid ")
                                      .slice(0, -2)
                                      .concat('.');
                      return ctx.redirect('/auth/register?error=' + encodeURIComponent(msg));
                  });
});

router.get(`/auth/discord/link`, async ctx =>
{
    if (ctx.isAuthenticated())
    {
        return ctx.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=561421057622278174&redirect_uri=${encodeURIComponent(`${ctx.request.origin}/auth/discord/callback`)}&response_type=code&scope=identify`);
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
});

router.get('/auth/discord/callback', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        if (!ctx.request.query.code)
        {
            ctx.status = 400;
            return Promise.resolve();
        }
        const code = ctx.request.query.code;
        const creds = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`);
        return fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(`${ctx.request.origin}/auth/discord/callback`)}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${creds}`,
                },
            })
            .then(req => req.json())
            .then(json => fetch(`http://discordapp.com/api/users/@me`,
                {
                    headers: {
                        Authorization: `Bearer ${json.access_token}`,
                    },
                }))
            .then(req => req.json())
            .then(async json => await queries.linkDiscord(ctx.req.user.id, json.id))
            // .then(user => logger.info(user))
            .then(ctx.redirect('/auth/status'));
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
    // ctx.status = 200;
    // return ctx.redirect(`/?token=${data.access_token}`);
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
        await ctx.render("auth/login.pug", {
            csrf: ctx.csrf,
            error: ctx.request.query.error,
        });
    }
    else
    {
        ctx.redirect('/');
    }
});

router.post('/auth/login', authRateLimit, async ctx =>
{
    ctx.request.body.username = ctx.request.body.username.toLowerCase();
    return passport.authenticate('local', (err, user) =>
    {
        if (user)
        {
            logger.verbose('User ' + user.firstname + ' ' + user.lastname + ' logged in successfully.');
            ctx.login(user);
            ctx.redirect('/');
        }
        else
        {
            logger.verbose('User ' + user.firstname + ' ' + user.lastname + ' failed login.');
            ctx.redirect('/auth/login?error=Invalid username or password%2E');
        }
    })(ctx);
});

router.get('/auth/logout', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        ctx.logout();
        ctx.redirect('/');
    }
    else
    {
        ctx.body = { success: false, };
        ctx.throw(401);
    }
});

module.exports = router;
