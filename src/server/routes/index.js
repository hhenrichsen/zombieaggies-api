const Router = require('koa-router');
const knex = require('../db/connections');

const router = new Router();

router.get('/', async (ctx) => {
    ctx.body = {
        status: 'Success',
        message: 'Hello world!'
    };
})

module.exports = router;