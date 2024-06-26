const logger = require('../../logger').default

const Router = require('koa-router')
const queries = require('../../../db/queries/locations')
const events = require('../../../db/queries/events')

const router = new Router()
const BASE_URL = `/locations`

router.get(BASE_URL, async ctx => {
  try {
    const locations = await queries.getAllLocations()
    ctx.body = {
      ...locations
    }
  } catch (err) {
    logger.error(new Error(err))
  }
})

router.get(`${BASE_URL}/:id`, async ctx => {
  try {
    const location = await queries.getSingleLocation(ctx.params.id)
    if (location) {
      ctx.body = {
        ...location
      }
    } else {
      ctx.status = 404
      ctx.body = {
        status: 'Error',
        message: 'That location does not exist.'
      }
    }
  } catch (err) {
    logger.error(new Error(err))
  }
})

router.put(`${BASE_URL}/:id`, async ctx => {
  if (ctx.isAuthenticated()) {
    if (ctx.req.user && ctx.req.user.permissions.accessPointManagement) {
      const data = {
        owner: ctx.request.body.owner,
        active: ctx.request.body.active
      }
      const location = await queries.updateLocation(ctx.params.id, data)
      if (location) {
        await events.addEvent(
          ctx.req.user.id,
          'modified point',
          ctx.params.id,
          data
        )
        ctx.status = 200
        ctx.body = {
          ...location[0]
        }
      } else {
        ctx.status = 404
        ctx.body = {
          status: 'error',
          message: 'That location does not exist.'
        }
      }
    } else {
      ctx.status = 403
    }
  } else {
    ctx.status = 401
  }
})

module.exports = router
