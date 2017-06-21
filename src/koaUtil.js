'use strict'
const _ = require('ramda')

const HTTPResponse = (status, body) => {
    return {
        status,
        body: body ? body : {}
    }
}

const OK = (response) => HTTPResponse(200, response)

// New record(s) created in system
const ResourceCreated = (response) => HTTPResponse(201, response ? response : {
    success: 'Resource created successfully'
})

// In case of data or business validation failure
const BadRequest = (errorResponse) => HTTPResponse(400, _.is(Object, errorResponse) ? errorResponse : {
    error: errorResponse ? errorResponse : 'Bad Request'
})

// Request from non logged in user/client
const UnauthorizedRequest = (errorResponse) => HTTPResponse(401, _.is(Object, errorResponse) ? errorResponse : {
    error: errorResponse ? errorResponse : 'You are not authorized'
})

// Malicios or non supported request from business logic poiunt of view
const ForbiddenRequest = (errorResponse) => HTTPResponse(403, _.is(Object, errorResponse) ? errorResponse : {
    error: errorResponse ? errorResponse : 'Forbidden Request'
})

const InternalServerError = (errorResponse) => HTTPResponse(500, _.is(Object, errorResponse) ? errorResponse : {
    error: errorResponse ? errorResponse : 'Server Error. Please contact your admin.'
})

/* eslint-disable */
function wrapHandler(handler) {
    return function*(next) {
        try {
            const response = yield handler(this.request.body, _.merge(this, {}), next)
            if (response.templateName)
            {
                yield this.render(response.templateName, response.templateParams)
            }
            if (response.redirect)
                this.redirect(response.redirect)
            for (const key in response)
                this[key] = response[key]
        } catch (error) {
            console.log(error)
            this.status = 500
            this.body = {
                error: ' Internal Server Error. Please contact your administrator.'
            }
        }
    }
}
/* eslint-enable */

const wrapHandlerModule = (module) => _.fromPairs(
    _.map(([name, fun]) => [name, wrapHandler(fun)],
        _.toPairs(module)))


module.exports = {
    wrapHandlerModule,
    OK,
    ResourceCreated,
    BadRequest,
    UnauthorizedRequest,
    ForbiddenRequest,
    InternalServerError
}
