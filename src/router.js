
const Router = require('koa-router')
const router = new Router()

const authenticatorRouter = require('./authenticator/router')
const module1 = require('./module1/router')
const module2 = require('./module2/router')

router.use(authenticatorRouter.routes(), authenticatorRouter.allowedMethods())
router.use(module1.routes(), module1.allowedMethods())
router.use(module2.routes(), module2.allowedMethods())

module.exports = router
