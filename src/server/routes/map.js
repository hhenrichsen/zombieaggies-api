const Router = require('koa-router');

const router = new Router();

router.get('/map/', async ctx =>
{
    let date = new Date();
    if ((date.getMonth() === 4 && date.getDay() >= 2) ||
        (ctx.isAuthenticated() && ctx.req.user.viewHiddenTabs))
    {
        await ctx.render("map");
    }
    else
    {
        ctx.status = 404;
    }
});

module.exports = router;