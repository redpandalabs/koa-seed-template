'use strict'


const _ = require('ramda')
const mongo = require('../services/mongo')
const util = require('../util')
const config = require('../../config')

/* eslint-disable */
function* checkAuthorizedAdmin(next) {
    const authTokenReceived = this.request.header['auth-token']
    if (_.isNil(authTokenReceived) || _.isEmpty(authTokenReceived)) {
        this.status = 401
        this.body = {
            error: 'You are not authorized'
        }
        return
    }
    const secret = config.AUTHENTICATION_RANDOM_KEY
    const weeksSinceEpochTime = Math.floor(Date.now() / util.milliSecondsInOneWeek)
    const key = util.sha256(secret.concat(weeksSinceEpochTime))
    let authToken
    try {
        authToken =  util.AES_decrypt(key, authTokenReceived)
    } catch(e) {
        this.status = 401
        this.body = {
            error: 'You are not authorized'
        }
        return
    }

    const splitAuthToken = authToken.split(':')
    const expectedSecret = splitAuthToken[0]
    const expectedEmail = splitAuthToken[1]
    const expectedEncryptedPassword = splitAuthToken[2]

    if(!_.equals(secret, expectedSecret)) {
        this.status = 401
        this.body = {
            error: 'You are not authorized'
        }
        return
    }

    const adminData = yield mongo.user.findOne({
        email: expectedEmail
    })

    if (!_.isEmpty(adminData)) {
        const actualPassword = util.md5(adminData.encryptedPassword)
        if (_.equals(expectedEncryptedPassword, actualPassword)) {
            this.adminData = adminData
            yield next
        } else {
            this.status = 401
            this.body = {
                error: 'You are not authorized'
            }
            return
        }
    } else {
        this.status = 401
        this.body = {
            error: 'You are not authorized'
        }
        return
    }
}
/* eslint-enable */

module.exports = {
    checkAuthorizedAdmin
}
