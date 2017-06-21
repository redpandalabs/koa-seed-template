'use strict'

const {
    wrapHandlerModule
} = require('../koaUtil')

const schema = require('./schema')
const handler = wrapHandlerModule(require('./handler'))
const Router = require('koa-router')
const interceptor = require('./interceptor')

const router = new Router({
    prefix: '/module1'
})

router.use(interceptor.checkAuthorizedAdmin)

router.post('/handlerFunction1', schema.handlerFunction1, handler.handlerFunction1)

module.exports = router
