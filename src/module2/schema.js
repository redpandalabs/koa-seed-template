'use strict'

const validator = require('fn-validator')
const _ = require('ramda')
const object = validator.object
const string = validator.string
// const array = validator.array
// const number = validator.number
// const all = validator.all
// const minLength = validator.minLength

const handlerFunction1 = object({
    _id: string,
})

const schemas = {
    handlerFunction1
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
