const logger = require('../../logger');

const users = require('../../db/queries/users');
const events = require('../../db/queries/events');

const Router = require('koa-router');

const router = new Router();
const BASE_URL = `/tags`;

module.exports = router;