'use strict'

const {
  OK,
  BadRequest
} = require('../koaUtil')
const _ = require('ramda')
const util = require('../util')
const mongo = require('../services/mongo')
const emailService = require('../services/email')
const config = require('../../config')

function* signIn({
    email,
    password
}, context) { //eslint-disable-line

    const adminData = yield mongo.user.findOne({email})

    if (_.isNil(adminData))
        return BadRequest('Invalid email or password')

    const salt = util.sha256(adminData.registrationTime.toString())
    const encryptedPassword = util.bcryptPassword(password, salt)

    if (_.not(_.equals(encryptedPassword, adminData.encryptedPassword)))
        return BadRequest('Invalid email or password')

    const secret = config.AUTHENTICATION_RANDOM_KEY
    const weeksSinceEpochTime = Math.floor(Date.now() / util.milliSecondsInOneWeek)
    const key = util.sha256(secret.concat(weeksSinceEpochTime))
    const authToken = secret.concat(':', email, ':', util.md5(encryptedPassword))
    const authTokenToBeSent =  util.AES_encrypt(key, authToken)

    return OK({
        authToken: authTokenToBeSent
    })

}

function* sendResetEmail({
    email
}, context) { //eslint-disable-line
    const randomString = util.randomString(4)
    const userData = yield mongo.user.update({email}, {
        passwordResetCode: randomString
    })
    if(userData.nModified === 1 && userData.ok === 1) {
        emailService.sendEmail('RESET_PASSWORD', ['manish.singh@theredpandas.com'], [{
            verificationCode: randomString
        }])
        return OK({email})
    }
    return BadRequest({error: 'Email is not registered with koko surveys.'})
}

function* resetPassword({
    email,
    password,
    confirmPassword,
    verificationCode
}, context) { //eslint-disable-line
    if (!_.equals(password, confirmPassword))
        return BadRequest({error: 'Password and confirm password does not match.'})

    const userData = yield mongo.user.findOne({
        email, passwordResetCode: verificationCode
    })

    if(userData && !_.isEmpty(userData)) {
        const salt = util.sha256(userData.registrationTime.toString())
        const encryptedPassword = util.bcryptPassword(password, salt)
        if (_.equals(userData.encryptedPassword, encryptedPassword))
            return OK()
        const updatedDetails = yield mongo.user.update({_id: userData._id}, {
            $set: {encryptedPassword}
        })
        if (updatedDetails && updatedDetails.nModified === 1 && updatedDetails.ok === 1)
            return OK()
        return BadRequest({error: 'Some error occured.'})
    }
    return BadRequest({error: 'Invalid credentials'})
}

module.exports = {
    signIn,
    sendResetEmail,
    resetPassword
}
