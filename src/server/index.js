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
app.use(require("./routes/index").routes());


const server = app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
module.exports.stop = () => {
    server.close();
}