const Router = require('koa-router');
const passport = require('koa-passport');
const queries = require('../../../db/queries/users');
const events = require('../../../db/queries/events');
const logger = require('../../logger');
const btoa = require('btoa');
const fetch = require('node-fetch');
const mail = require('../../services/mail');
const crypto = require('crypto');

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

router.post('/auth/forgot', authRateLimit, async ctx => {
    if (ctx.request.body.email === undefined) {
        ctx.status = 400;
        ctx.message = "Email is required.";
        return Promise.resolve();
    }

    const testUser = (await queries.hasUser(ctx.request.body.email.toLowerCase()));
    logger.info(testUser);
    logger.info(`${testUser !== undefined} ${testUser.id !== undefined} ${testUser.email !== undefined}`);
    if(testUser !== undefined && testUser.id !== undefined && testUser.email !== undefined) {
        const resetToken = crypto.randomBytes(20).toString('hex');
        const user = await queries.getUser(testUser.id);
        await queries.generatePasswordReset(user.id, resetToken);
        const resetUrl = `https://zombieaggies.me/auth/reset?token=${resetToken}`;
        const email = {
                to: user.email,
                from: 'ZombieAggies <robot@zombieaggies.me>',
                subject: 'Password Reset',
                html: `<p>Someone has requested a password reset for your account on the <a href="https://zombieaggies.me">Zombie Aggies</a> site.</p>

                <p>If this was you, click <a href="${resetUrl}">here</a>, or paste ${resetUrl} into your browser.

                <p>Your reset token is <strong>${resetToken}</strong>.</p>`,
        };
        await mail.send(email);
        ctx.status = 200;
        ctx.redirect('/auth/forgotSent');
        return Promise.resolve();
    }
    ctx.status = 400;
    return Promise.resolve();
});

router.get('/auth/reset', async ctx => {
    const token = ctx.query.token;
    return ctx.render('auth/reset', { error: token === undefined ? 
        'Invalid reset token please type it manually.' : undefined, 
        token: token, csrf: ctx.csrf, });
});

router.get('/auth/forgotSent', async ctx => ctx.render('auth/forgotSent.pug'));

router.post('/auth/reset', authRateLimit, async ctx => {
    if(ctx.request.body.token === undefined) {
        ctx.status = 400;
        ctx.message = 'Token is required.';
        return Promise.resolve();
    }
    if(ctx.request.body.password === undefined) {
        ctx.status = 400;
        ctx.message = 'Password is required.';
        return Promise.resolve();
    }
    const user = await queries.getUserByResetToken(ctx.request.body.token);
    if(user === undefined) {
        ctx.status = 400;
        ctx.message = 'Invalid token.';
        return Promise.resolve();
    }
    const res = await queries.updatePassword(user.id, ctx.request.body.password);
    if(res === 1) {
        ctx.status = 200;
        ctx.redirect('/auth/login');
        return Promise.resolve();
    }
    ctx.status = 400;
    ctx.message = 'Invalid or expired token.';
    return Promise.resolve();
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
                              return ctx.redirect('/start');
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
        return ctx.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent(`${ctx.request.origin}/auth/discord/callback`)}&response_type=code&scope=identify`);
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
        return fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${creds}`,
                },
                body: {
                    code,
                    redirect_uri: `${ctx.request.origin}/auth/discord/callback`
                }
            })
            .then(req => req.json())
            .then(data => { logger.debug(data); return data; })
            .then(json => fetch(`http://discordapp.com/api/users/@me`,
                {
                    headers: {
                        Authorization: `Bearer ${json.access_token}`,
                    },
                }))
            .then(req => req.json())
            .then(data => { logger.debug(data); return data; })
            .then(async json => await queries.linkDiscord(ctx.req.user.id, json.id))
            .then(data => { logger.debug(data); return data; })
            .then(ctx.redirect('/auth/status'))
            .catch((e) => logger.error(e));
    }
    else
    {
        ctx.status = 401;
        return Promise.resolve();
    }
    // ctx.status = 200;
    // return ctx.redirect(`/?token=${data.access_token}`);
});

router.get('/auth/status', async ctx => {
    if (ctx.isAuthenticated()) {
        if(ctx.req.user.tosAgree !== undefined && ctx.req.user.tosAgree === false) {
            return ctx.redirect("/start/tos");
        }
        if(ctx.req.user.active || (ctx.query['ignore_redirect'] !== undefined && ctx.query['ignore_redirect'] === 'true')) {
            await ctx.render("auth/status.pug", { csrf: ctx.csrf });
        }
        else if(!ctx.req.user.active) {
            return ctx.redirect("/start/active");
        }
    }
    else {
        ctx.redirect('/auth/login');
    }
});

router.get('/auth/forgot', async ctx => {
    await ctx.render("auth/forgot.pug", {
            csrf: ctx.csrf,
    });
});

router.get('/auth/forgot-sent', async ctx => await ctx.render("auth/forgotSent.pug"));

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
    ctx.request.body.username = ctx.request.body.email.toLowerCase();
    return passport.authenticate('local', (err, user) =>
    {
        if (user)
        {
            logger.verbose('User ' + user.firstname + ' ' + user.lastname + ' logged in successfully.');
            ctx.login(user);
            ctx.redirect('/auth/status');
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
