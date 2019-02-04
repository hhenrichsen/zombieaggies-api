require('dotenv').config();
const Koa = require('koa');
const views = require("koa-views");
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('koa-passport');
const RedisStore = require('koa-redis');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.keys = [process.env.SECRET];
app.use(session(app));

app.use(bodyParser());

require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// app.use(session({
//     store: new RedisStore()
// }, app));

app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
})

app.use(views(__dirname + "/templates", { extension: 'pug' }));

app.use(require('koa-mount')('/static/', require('koa-static')('src/server/static')));

app.use(require("./routes/teams").routes());
app.use(require("./routes/locations").routes());
app.use(require("./routes/manage").routes());
app.use(require("./routes/auth").routes());
app.use(require("./routes/map").routes());
app.use(require("./routes/index").routes());


const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);

    if (process.env.ENABLE_POINTS)
        setInterval(async () => {
            const locQuery = await require('./db/queries/locations').getAllLocations();
            const teamQuery = await require('./db/queries/teams').getAllTeams();
            const locations = Object.values(locQuery);
            const teams = Object.values(teamQuery);
            // console.log(teams);
            // console.log(locations);
            for (let loc of locations) {
                let owner = teams.filter(i => i.id === loc.owner && i.points >= 0);
                if (owner.length == 1) {
                    await require('./db/queries/teams').updateTeam(owner[0].id, { points: ++owner[0].points });
                }
            }
        }, 60 * 1000);
});

module.exports = server;
module.exports.stop = () => {
    server.close();
}