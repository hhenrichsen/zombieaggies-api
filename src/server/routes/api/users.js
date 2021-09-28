const logger = require('../../logger').default

const users = require('../../../db/queries/users')
const events = require('../../../db/queries/events')
const tags = require('../../../db/queries/tags')

const Router = require('koa-router')

const router = new Router()
const BASE_URL = `/users`

let cleanUserBasedOnPermissions = async function (
  user,
  permissions = {
    accessUserManagement: false,
    viewOZ: false
  }
) {
  let toReturn = { ...user }
  if (!permissions.accessUserManagement) {
    delete toReturn['email']
    delete toReturn['phone']
    delete toReturn['aNumber']
    delete toReturn['bandanna']
    delete toReturn['permissions']
    delete toReturn['code']
    delete toReturn['discord']
    delete toReturn['dead']
    delete toReturn['tosAgree']
  }
  if (!permissions.viewOZ) {
    if (await tags.isOZ(user.id)) {
      toReturn.tags = 0
      toReturn.team = 1
      toReturn.title = 'Player'
    }
  }
  return toReturn
}

router.get(`${BASE_URL}`, async ctx => {
  try {
    const result = await users.getAllUsers()

    const revised = result.map(
      async i =>
        await cleanUserBasedOnPermissions(
          i,
          ctx.req.user ? ctx.req.user.permissions : {}
        )
    )
    await Promise.all(revised).then(revised => {
      ctx.status = 200
      ctx.body = {
        ...revised
      }
    })
    return Promise.resolve()
  } catch (err) {
    logger.error(err)
    return Promise.reject(err)
  }
})

router.get(`${BASE_URL}/:id`, async ctx => {
  const result = await users.getUser(parseInt(ctx.params.id))

  if (!result) {
    ctx.status = 404
    return Promise.resolve()
  }
  ctx.status = 200
  ctx.body = {
    ...(await cleanUserBasedOnPermissions(
      result,
      ctx.req.user ? ctx.req.user.permissions : {}
    ))
  }
  return Promise.resolve()
})

router.get(`${BASE_URL}/:id/makeOZ`, async ctx => {
  if (ctx.isAuthenticated()) {
    if (
      ctx.req.user.permissions.viewOZ &&
      ctx.req.user.permissions.accessUserManagement &&
      ctx.req.user.permissions.useAdminRoutes
    ) {
      const result = await tags.addOZ(parseInt(ctx.params.id))

      if (!result) {
        ctx.status = 404
        return Promise.resolve()
      }
      ctx.status = 200
      ctx.body = {
        ...(await result)
      }
      return Promise.resolve()
    } else {
      ctx.status = 403
      return Promise.resolve()
    }
  } else {
    ctx.status = 401
    return Promise.resolve()
  }
})

router.get(`${BASE_URL}/:id/removeOZ`, async ctx => {
  if (ctx.isAuthenticated()) {
    if (
      ctx.req.user.permissions.viewOZ &&
      ctx.req.user.permissions.accessUserManagement &&
      ctx.req.user.permissions.useAdminRoutes
    ) {
      const result = await tags.removeOZ(parseInt(ctx.params.id))

      if (!result) {
        ctx.status = 404
        return Promise.resolve()
      }
      ctx.status = 200
      ctx.body = {
        ...(await result)
      }
      return Promise.resolve()
    } else {
      ctx.status = 403
      return Promise.resolve()
    }
  } else {
    ctx.status = 401
    return Promise.resolve()
  }
})

if (process.env.NODE_ENV === 'development') {
  router.get(`${BASE_URL}/:id/isOZ`, async ctx => {
    if (ctx.isAuthenticated()) {
      if (
        ctx.req.user.permissions.viewOZ &&
        ctx.req.user.permissions.accessUserManagement &&
        ctx.req.user.permissions.useAdminRoutes
      ) {
        const result = await tags.isOZ(parseInt(ctx.params.id))

        if (!result) {
          ctx.status = 404
          return Promise.resolve()
        }
        ctx.status = 200
        ctx.body = {
          result
        }
        return Promise.resolve()
      } else {
        ctx.status = 403
        return Promise.resolve()
      }
    } else {
      ctx.status = 401
      return Promise.resolve()
    }
  })
}

router.put(`${BASE_URL}/:id`, async ctx => {
  if (
    ctx.isAuthenticated() &&
    ctx.req.user.permissions.accessUserManagement &&
    ctx.req.user.permissions.useAdminRoutes
  ) {
    delete ctx.request.body['password']
    delete ctx.request.body['permissions']
    delete ctx.request.body['code']
    delete ctx.request.body['id']
    try {
      const user = await users
        .updateUser(parseInt(ctx.params.id), ctx.request.body)
        .catch(err => {
          ctx.status = 400
          ctx.body = err.message
        })
      events.addEvent(
        ctx.req.user.id,
        ' updated user ',
        ctx.params.id,
        ctx.request.body
      )
      ctx.status = 200
    } catch (err) {
      logger.error(err)
      return Promise.reject(err)
    }
  } else {
    ctx.status = 404
    return Promise.resolve()
  }
})

router.put(`${BASE_URL}/:id/permissions`, async ctx => {
  if (
    ctx.isAuthenticated() &&
    ctx.req.user.permissions.accessUserManagement &&
    ctx.req.user.permissions.useAdminRoutes
  ) {
    try {
      await users
        .updatePerms(parseInt(ctx.params.id), ctx.request.body)
        .catch(err => {
          ctx.status = 400
          ctx.body = err.message
        })
      ctx.status = 200
    } catch (err) {
      logger.error(err)
      return Promise.reject(err)
    }
  } else {
    ctx.status = 404
    return Promise.resolve()
  }
})

// router.get(`${BASE_URL}/:id/moderator`, async ctx =>
// {
//     if (ctx.isAuthenticated() &&
//         ctx.req.user.permissions.useAdminRoutes &&
//         ctx.req.user.permissions.accessUserManagement)
//     {
//         // if (ctx.req.user.id === parseInt(ctx.params.id))
//         // {
//         //     ctx.status = 400;
//         //     ctx.body = {
//         //         message: "You cannot promote yourself.",
//         //     };
//         //     return Promise.resolve();
//         // }
//
//         const user = await users.getUser(ctx.params.id);
//         users.makeModerator(ctx.params.id);
//
//         events.addEvent(ctx.req.user.id, "promoted", ctx.params.id);
//         logger.info(`${ctx.req.user.firstname} ${ctx.req.user.lastname} promoted user ${user.firstname} ${user.lastname} to Moderator`);
//
//         ctx.status = 200;
//         ctx.body = {
//             message: "Success!",
//         };
//         return Promise.resolve();
//     }
//     else
//     {
//         ctx.status = 404;
//         return Promise.resolve();
//     }
// });

router.del(`${BASE_URL}/:id`, async ctx => {
  if (
    ctx.isAuthenticated() &&
    ctx.req.user.permissions.useAdminRoutes &&
    ctx.req.user.permissions.accessUserManagement
  ) {
    if (ctx.req.user.id === parseInt(ctx.params.id)) {
      ctx.status = 400
      ctx.body = {
        message: 'You cannot delete yourself.'
      }
      return Promise.resolve()
    }

    const user = await users.getUser(ctx.params.id)
    users.deleteUser(ctx.params.id)

    events.addEvent(ctx.req.user.id, 'deleted', ctx.params.id)
    logger.info(
      `${ctx.req.user.firstname} ${ctx.req.user.lastname} deleted ${user.firstname} ${user.lastname}.`
    )

    ctx.status = 200
    ctx.body = {
      message: 'Success!'
    }
    return Promise.resolve()
  } else {
    ctx.status = 404
    return Promise.resolve()
  }
})

router.get(`${BASE_URL}/:id/toggleBandanna`, async ctx => {
  if (
    ctx.isAuthenticated() &&
    ctx.req.user.permissions.useAdminRoutes &&
    ctx.req.user.permissions.accessUserManagement
  ) {
    const result = await users.toggleBandanna(parseInt(ctx.params.id))
    ctx.status = 200
    ctx.body = {
      ...result
    }
    return Promise.resolve()
  } else {
    ctx.status = 404
    return Promise.resolve()
  }
})

router.get(`${BASE_URL}/:id/regenCode`, async ctx => {
  if (
    ctx.isAuthenticated() &&
    ctx.req.user.permissions.useAdminRoutes &&
    ctx.req.user.permissions.accessUserManagement
  ) {
    const result = await users.generateCode(parseInt(ctx.params.id))
    if (result === undefined) {
      ctx.status = 404
      return Promise.resolve()
    }
    ctx.status = 200
    ctx.body = {
      ...result
    }
    return Promise.resolve()
  } else {
    ctx.status = 404
    return Promise.resolve()
  }
})

module.exports = router
