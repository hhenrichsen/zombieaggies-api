const Router = require('koa-router');
const queries = require('../db/queries/locations');

const router = new Router();
const BASE_URL = `/api/v1/locations`;

router.get(BASE_URL, async (ctx) => {
    try {
        const locations = await queries.getAllLocations();
        ctx.body = {
            status: 'Success',
            data: locations
        };
    } catch (err) {
        console.log(err)
    }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
    try {
        const location = await queries.getSingleLocation(ctx.params.id);
        if (location.length) {
            ctx.body = {
                status: 'Success',
                data: location
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'Error',
                message: 'That location does not exist.'
            };
        }
    } catch (err) {
        console.log(err)
    }
})

module.exports = router;