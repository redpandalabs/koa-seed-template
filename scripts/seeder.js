const mongo = require('../src/services/mongo')
const co = require('co')
const util = require('../src/util')
const _ = require('ramda')

const email = 'abc@xyz.com'
const password = '12345678'
const registrationTime = 1490940037435
const salt = util.sha256(_.toString(registrationTime)) //
const encryptedPassword = util.bcryptPassword(password, salt)

const userData = {
    email,
    encryptedPassword,
    registrationTime
}

function* seeder() { //eslint-disable-line fp/no-nil
    yield _.map((collection) => collection.remove(), _.values(mongo))
    yield mongo.user.create(userData)
    console.log('successfull---') //eslint-disable-line
}

co(seeder).catch(function(error) {
    return error
})
