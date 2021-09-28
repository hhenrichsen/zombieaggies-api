const Router = require('koa-router')

const router = new Router()

const BASE_URL = '/legal'

router.get(`${BASE_URL}/tos`, async ctx => ctx.render('legal/terms'))

router.get(`${BASE_URL}/privacy`, async ctx => ctx.render('legal/privacy'))

module.exports = router
