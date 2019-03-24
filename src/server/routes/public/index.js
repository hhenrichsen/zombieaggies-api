const Router = require('koa-router');

const router = new Router();

router.get('/', async ctx =>
{
    await ctx.render("home");
});

router.get('/rules', async ctx =>
{
    await ctx.render("rules");
});

router.get('/map/', async ctx =>
{
    let date = new Date();
    if ((date.getMonth() === 4 && date.getDay() >= 2) ||
        (ctx.isAuthenticated() && ctx.req.user.permissions.viewHiddenTabs))
    {
        await ctx.render("map");
    }
    else
    {
        ctx.status = 404;
    }
});

module.exports = router;