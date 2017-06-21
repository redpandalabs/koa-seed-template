'use strict'

const validator = require('fn-validator')
const _ = require('ramda')
const object = validator.object

const string = validator.string
const email = validator.email
const all = validator.all
const minLength = validator.minLength

const signIn = object({
    email: email,
    password: string
})

const sendResetEmail = object({
    email: email
})

const resetPassword = object({
    verificationCode: all([string, minLength(1)]),
    password: all([string, minLength(1)]),
    confirmPassword: all([string, minLength(1)]),
    email: email
})

const schemas = {
    signIn,
    sendResetEmail,
    resetPassword
}

/* eslint-disable */
function validate(schema) {
    return function*(next) {
        const result = validator.validate(schema, this.request.body)
        if (!_.isEmpty(result)) {
            this.body = result
            this.status = 400
        } else
            yield next
    }
}


for (let schema in schemas)
    schemas[schema] = validate(schemas[schema])
/* eslint-enable */

module.exports = schemas
