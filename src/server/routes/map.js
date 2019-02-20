const Router = require('koa-router');

const router = new Router();

router.get('/map/', async ctx =>
{
    await ctx.render("map");
});

module.exports = router;