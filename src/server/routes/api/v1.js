const Router = require('koa-router');
const locations = require('./locations').routes();
const users = require('./users').routes();
const tags = require('./tags').routes();
const teams = require('./teams').routes();
const me = require('./me').routes();

const router = new Router();

const BASE_URL = `/api/v1`;

router.use(BASE_URL, locations, teams, users, tags, me);

module.exports = router;