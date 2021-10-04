require('dotenv').config()
const Koa = require('koa')
const discord = require('../discord/bot')
const bot = new discord.Harbinger()

//Middleware
const views = require('koa-views')
const bodyParser = require('koa-bodyparser')

//Auth
const session = require('koa-session')
const passport = require('koa-passport')
const CSRF = require('koa-csrf')
const RedisStore = require('koa-redis')

const logger = require('./logger').default

bot.start().catch(err => {
  logger.error('Harbinger failed to launch.')
  logger.error(err)
})

const app = new Koa()
const PORT = process.env['PORT'] || 3000

app.keys = [process.env['SECRET']]

if (process.env.NODE_ENV === 'production') {
  app.use(
    session(
      {
        store: new RedisStore({
          url: process.env['REDIS_URL']
        })
      },
      app
    )
  )
} else {
  app.use(session(app))
}

app.use(bodyParser())

require('./auth')
app.use(passport.initialize())
app.use(passport.session())

if (process.env.NODE_ENV !== 'test') {
  app.use(
    new CSRF({
      invalidTokenMessage: 'Invalid CSRF token',
      invalidTokenStatusCode: 403,
      excludedMethods: ['GET', 'HEAD', 'OPTIONS'],
      disableQuery: false
    })
  )
}

app.use(
  views(__dirname + '/../../../templates', {
    extension: 'pug'
  })
)

app.use(
  require('koa-mount')(
    '/static/',
    require('koa-static')('dist/', {
      setHeaders (res) {
        res.setHeader('Cache-Control', 'max-age=86400')
      }
    })
  )
)
app.use(require('koa-json-mask')())

app.use(require('./routes/api/v1').routes())
app.use(require('./routes/public/auth').routes())
app.use(require('./routes/public/manage').routes())
app.use(require('./routes/public/index').routes())
app.use(require('./routes/public/admin').routes())
app.use(require('./routes/public/start').routes())
app.use(require('./routes/public/legal').routes())

app.use(async (ctx, next) => {
  try {
    await next()
    const status = ctx.status || 404
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.status = err.status || 500
    if (ctx.status === 404) {
      //Your 404.jade
      await ctx.render('404')
    } else {
      //other_error jade
      await ctx.render('error')
    }
  }
})

process.on('uncaughtException', ex => {
  logger.error(ex)
})

process.on('uncaughtRejection', ex => {
  logger.error(ex)
})

const server = app.listen(PORT, async () => {
  logger.info(`Server running.`)
  logger.verbose(`Running on port: ${PORT}`)

  if (process.env['ENABLE_POINTS']) {
    const timeout = (process.env['POINT_TIME_SECONDS'] || 60) * 1000
    logger.debug(
      `Points enabled. Setting point timeout to ${timeout} (${timeout /
        1000}s).`
    )
    setInterval(async () => {
      const locQuery = await require('../db/queries/locations').getAllLocations()
      const teamQuery = await require('../db/queries/teams').getAllTeams()
      const locations = Object.values(locQuery)
      const teams = Object.values(teamQuery)
      for (let loc of locations) {
        let owner = teams.filter(i => i.id === loc.owner && i.points >= 0)
        if (owner.length === 1) {
          logger.verbose(`${owner[0].name} gains a point from ${loc.name}`)
          await require('../db/queries/teams').updateTeam(owner[0].id, {
            points: ++owner[0].points
          })
        }
      }
    }, timeout)
  }
})

module.exports = {
  bot,
  stop: () => {
    server.close()
  }
}
