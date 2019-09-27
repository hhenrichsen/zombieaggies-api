const Router = require('koa-router');

const router = new Router();
const BASE_URL = `/start`;

router.get(`${BASE_URL}`, async ctx => {
    if(ctx.isAuthenticated()) {
        if(!ctx.req.user.active) {
            return ctx.redirect("/start/active");
        }
        else if(!ctx.req.user.tosAgree) {
            return ctx.redirect("/start/tos");
        }
    }
    ctx.status = 401;
    return ctx.redirect('/');
});

router.get(`${BASE_URL}/active`, async ctx => {
    if(ctx.isAuthenticated()) {
        if(ctx.req.user.active) {
            return ctx.redirect(`${BASE_URL}/discord`);
        }
        return ctx.render('start/active.pug');
    }
    else {
        ctx.status = 401;
        return ctx.redirect('/');
    }
})

router.get(`${BASE_URL}/tos`, async ctx => {
    if(ctx.isAuthenticated()) {
        if(ctx.req.user.tosAgree) {
            return ctx.redirect(`${BASE_URL}/discord`);
        }
        return ctx.render('start/tos.pug');
    }
    else {
        ctx.status = 401;
        return ctx.redirect('/');
    }
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
        ctx.status = 401;
        return ctx.redirect('/');
    }
});

module.exports = router;
