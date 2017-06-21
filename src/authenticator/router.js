'use strict'

const {
    wrapHandlerModule
} = require('../koaUtil')

const Router = require('koa-router')
const handler = wrapHandlerModule(require('./handler'))
const schema = require('./schema')

const router = new Router({
    prefix: '/authenticator'
})

router.post('/signIn', schema.signIn, handler.signIn)
router.post('/sendResetEmail', schema.sendResetEmail, handler.sendResetEmail)
router.post('/resetPassword', schema.resetPassword, handler.resetPassword)

module.exports = router
