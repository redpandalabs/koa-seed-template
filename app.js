'use strict'


// Koa framework - http://koajs.com/
const koa = require('koa')

// Compress HTTP response
const compress = require('koa-compress')

// Local config file
const config = require('./config')

// Business services endpoints
const router = require('./src/router')

// Enable cross origin HTTP requests
const cors = require('kcors')
// const path = require('path')

const koaBody = require('koa-body')(({
    multipart: true
}))

// enabling server side views for survey
const views = require('koa-views')


const app = new koa()
app.use(cors())
app.use(views('./src/templates',{ map: { html: 'handlebars'}}))
app.use(compress({
    level : 3 // for optimum speed to compression ratio
}))
//app.use(koaJsonLogger())

app.use(koaBody)
app.use(router.routes())
app.use(router.allowedMethods())

// Start server
app.listen(config.PORT)

// console.log(app)
//
// module.exports = app
