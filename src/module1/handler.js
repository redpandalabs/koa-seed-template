'use strict'


// -------------------------------------------------------------------------
const {
  OK,
  BadRequest
} = require('../koaUtil')
// const _ = require('ramda')
// const mongo = require('../services/mongo')

function* handlerFunction1({
    _id
}, context) { //eslint-disable-line

    const checkCondition = true
    yield {}
    if(checkCondition)
        return OK()
    return BadRequest()
}

module.exports = {
    handlerFunction1
}
