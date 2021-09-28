const logger = require('../../logger').default

const Router = require('koa-router')
const lore = require('../../../db/queries/lore')

const router = new Router()
const BASE_URL = `/lore`

router.get(`${BASE_URL}`, async ctx => {
  const res = await lore.getAllUnlocked()
  return ctx.render('lore/lore.pug', { lore: res })
})

router.get(`${BASE_URL}/:id`, async ctx => {
  const res = await lore.get(parseInt(ctx.params.id))
  if (res.link) {
    return ctx.redirect(res.link)
  } else {
    return ctx.render('lore/loreDetail.pug', { lore: res })
  }
})

router.get(`${BASE_URL}/unlock`, ctx =>
  ctx.render('lore/loreForm.pug', { csrf: ctx.csrf })
)

module.exports = router
