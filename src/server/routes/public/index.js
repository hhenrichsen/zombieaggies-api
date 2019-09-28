const events = require("../../../db/queries/events");
const users = require("../../../db/queries/users");
const tags = require("../../../db/queries/tags");
const teams = require("../../../db/queries/teams");
const lore = require("../../../db/queries/lore");
const logger = require("../../logger");

const Router = require('koa-router');

const router = new Router();

router.get('/', async ctx =>
{
    await ctx.render("home", { googleVerification: process.env["GOOGLE_VERIFICATION"], });
});

router.get('/rules', async ctx =>
{
    await ctx.render("rules");
});

router.get('/lore', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const list = await lore.getAllUnlocked();
        await ctx.render("lore", {
            lore: list,
            csrf: ctx.csrf
        });
    }
});

router.get('/lore/:id', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        const list = await lore.get(ctx.params.id);
        await ctx.render("loreItem", {
            lore: list,
            csrf: ctx.csrf
        });
    }
});

router.get('/map', async ctx =>
{
    if (ctx.isAuthenticated() && ctx.req.user.permissions.accessPointManagement)
    {
        await ctx.redirect('/manage');
    }
    else
    {
        await ctx.render("map");
    }
});

router.get('/tags', async ctx =>
{
    if (ctx.isAuthenticated())
    {
        let ev = await events.getEventsFromVerb('tagged');
        let evs = await Promise.all(ev.map(async event =>
        {
            let obj = {
                actor: {},
                target: {},
                team: 0,
                time: event.createdAt,
            };

            obj.team = event.info.team;

            const actor = await users.getUser(event.subject);
            if (actor)
            {

                if (await tags.isOZ(event.subject))
                {
                    obj.actor.name = "OZ";
                }
                else
                {
                    obj.actor.name = actor.firstname + (actor.nickname ? " \"" + actor.nickname + "\"" : "") + " " + actor.lastname;
                    obj.actor.id = actor.id;
                }
            }
            else
            {
                obj.actor.name = "[deleted]";
            }

            const target = await users.getUser(parseInt(event.target));
            if (target)
            {
                obj.target.name = target.firstname + (target.nickname ? " \"" + target.nickname + "\"" : "") + " " + target.lastname;
                obj.target.id = parseInt(event.target);
            }
            else
            {
                obj.target.name = "[deleted]";
            }
            return obj;
        }));

        let teamList = await teams.getAllTeams();

        await ctx.render("tags", {
            user: ctx.req.user,
            csrf: ctx.csrf,
            tags: evs,
            teams: teamList,
        });
    }
    else
    {
        ctx.status = 401;
    }
});

module.exports = router;
