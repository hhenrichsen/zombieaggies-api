const logger = require('../logger');

const Router = require('koa-router');
const queries = require('../db/queries/locations');
const events = require('../db/queries/events');

const router = new Router();
const BASE_URL = `/api/v1/locations`;

router.get(BASE_URL, async ctx =>
{
    try
    {
        const locations = await queries.getAllLocations();
        ctx.body = {
            status: 'Success',
            data: locations,
        };
    } catch (err)
    {
        logger.error(new Error(err))
    }
});

router.get(`${BASE_URL}/:id`, async ctx =>
{
    try
    {
        const location = await queries.getSingleLocation(ctx.params.id);
        if (location)
        {
            ctx.body = {
                status: 'Success',
                data: location,
            };
        }
        else
        {
            ctx.status = 404;
            ctx.body = {
                status: 'Error',
                message: 'That location does not exist.',
            };
        }
    } catch (err)
    {
        logger.error(new Error(err))
    }
});

router.get(`${BASE_URL}/:id/small`, async ctx =>
{
    try
    {
        const location = await queries.getSingleSmallLocation(ctx.params.id);
        if (location)
        {
            ctx.body = {
                status: 'Success',
                data: location,
            };
        }
        else
        {
            ctx.status = 404;
            ctx.body = {
                status: 'Error',
                message: 'That location does not exist.',
            };
        }
    } catch (err)
    {
        logger.error(err)
    }
});

router.put(`${BASE_URL}/:id`, async ctx =>
{
    try
    {
        if (ctx.isAuthenticated() && ctx.req.user && ctx.req.user.accessPointManagement)
        {
            const data = {
                owner: ctx.request.body.owner,
                active: ctx.request.body.active,
            };
            const location = await queries.updateLocation(ctx.params.id, data);
            if (location.length)
            {
                events.addEvent(ctx.req.user.id, "changed point " + ctx.params.id + " ownership to", ctx.request.body.owner, location);
                ctx.status = 200;
                ctx.body = {
                    status: 'success',
                    data: location[0],
                };
            }
            else
            {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    message: 'That location does not exist.',
                };
            }
        }
        else
        {
            ctx.status = 404;
        }
    } catch (err)
    {
        logger.error(new Error(err));
        ctx.status = 400;
        ctx.body = {
            status: 'error',
            message: err.message || 'Sorry, an error has occurred.',
        };
    }
});

module.exports = router;