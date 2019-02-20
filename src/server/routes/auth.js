const Router = require('koa-router');
const passport = require('koa-passport');
const queries = require('../db/queries/users');

const router = new Router();

router.get('/auth/register', async ctx =>
{
    await ctx.render("auth/register.pug", {csrf: ctx.csrf,});
});

router.post('/auth/register', async ctx =>
{
    const user = await queries.addUser(ctx.request.body);
    return passport.authenticate('local', (err, user, info, status) =>
    {
        if (user)
        {
            ctx.login(user);
            ctx.redirect('/auth/status');
        }
        else
        {
            ctx.redirect('/auth/register');
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

router.post('/auth/login', async ctx =>
    passport.authenticate('local', (err, user, info, status) =>
    {
        if (user)
        {
            ctx.login(user);
            ctx.redirect('/');
        }
        else
        {
            ctx.redirect('/auth/login');
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
