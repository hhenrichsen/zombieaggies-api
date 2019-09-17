const Router = require('koa-router');

const router = new Router();
const BASE_URL = `/start`;

router.get(`${BASE_URL}`, async ctx => ctx.render('start/index.pug'));

router.get(`${BASE_URL}/active`, async ctx => 
{
    if(ctx.req.user.active)
    {
        return ctx.redirect(`${BASE_URL}/discord`);
    }
    return ctx.render('start/active.pug');
})

router.get(`${BASE_URL}/discord`, async ctx => 
{
    if (ctx.isAuthenticated()) 
    {
        if (ctx.req.user.discord) 
        {
            return ctx.redirect('/auth/status')
        } 
        else 
        {
            return ctx.render('start/discord.pug');
        }
    }
    else 
    {
        return ctx.redirect('/');
    }
});

module.exports = router;