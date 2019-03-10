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

module.exports = router;