const logger = require("../../logger").default;

const events = require("../../../db/queries/events");
const tags = require("../../../db/queries/tags");
const users = require("../../../db/queries/users");

const RateLimit = require("koa2-ratelimit").RateLimit;

const Router = require("koa-router");

const bot = require("../../../discord/bot");

const tagRateLimit = RateLimit.middleware({
  interval: 5 * 60 * 1000, // 5 minutes
  max: 5,
  prefixKey: "tags", // to allow the bdd to Differentiate the endpoint
});

const router = new Router();
const BASE_URL = `/tags`;

router.get(`${BASE_URL}`, async (ctx) => {
  let _events = await events.getEventsFromVerb("tagged");
  ctx.body = await Promise.all(
    _events.map(async (event) => {
      if (
        (await tags.isOZ(event.subject)) &&
        (await users.getUser(event.subject)).team === 2
      ) {
        event.subject = "OZ";
      }
      return event;
    })
  );
  ctx.status = 200;
  return Promise.resolve();
});

router.post(`${BASE_URL}/add`, tagRateLimit, async (ctx) => {
  if (ctx.isAuthenticated()) {
    if (ctx.request.body.code !== undefined) {
      let id = await tags.getIdFromCode(ctx.request.body.code.toUpperCase());
      if (id.length === 1) {
        return await tags
          .tagUser(ctx.req.user.id, id[0].user)
          .then(async (user) => {
            await bot.getInstance().updateUser(user);
            return user;
          })
          .then(async () => {
            ctx.status = 200;
            ctx.body = "Success!";
            ctx.redirect("/tags");
            return Promise.resolve();
          })
          .catch((err) => {
            ctx.status = 400;
            ctx.body = {
              message: err.message,
            };
            return Promise.resolve();
          });
      } else {
        ctx.status = 400;
        ctx.body = {
          message: "Invalid code.",
        };
        return Promise.resolve();
      }
    } else {
      ctx.status = 400;
      ctx.body = {
        message: "Property `code` is required.",
      };
      return Promise.resolve();
    }
  } else {
    ctx.status = 401;
    return Promise.resolve();
  }
});

module.exports = router;
