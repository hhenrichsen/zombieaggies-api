const Koa = require('koa');

const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(require('./routes/index').routes());
app.use(require("./routes/teams").routes());
app.use(require("./routes/locations").routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
module.exports.stop = () => server.close();