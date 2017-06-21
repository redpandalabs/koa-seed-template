// Utility Functions
'use strict'

const crypto = require('crypto')
const _ = require('ramda')
const bcrypt = require('bcrypt')

const iv = 'asdfasdfasdfasdf'

const randomString = (length) => crypto.randomBytes(length ? length : 64).toString('hex')

const randomNumber = (length) =>
    _.isEmpty(length) ? Math.floor(Math.random() * 9999999) : parseInt(Math.floor(Math.random() * 9999999).toString().slice(0, length))

const randomStringWithTimestamp = () => crypto.randomBytes(2).toString('hex').toUpperCase() + Date.now()

const milliSecondsInOneWeek = 1000 * 60 * 60 *24 * 7

const padLeftZero = (number) => (number < 10) ? '0'.concat(number) : number

const formatDateToDDMMYYYY = (date) => _.join('-', _.map(padLeftZero, [date.getDate(), date.getMonth() + 1, date.getFullYear()]))

// hash users password using SHA512
const sha512 = (password, salt) => {
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    const value = hash.digest('hex')
    return value
}

const sha256 = (data) => {
    const hash = crypto.createHash('sha256')
    hash.update(data)
    const value = hash.digest('hex')
    return value
}

const bcryptPassword = (password, salt) => {
    // salt must be in the form => $Vers$log2(NumRounds)$saltvalue
    const formattedSalt = '$2a$10$'.concat(salt)
    return bcrypt.hashSync(password, formattedSalt)
}

const AES_encrypt = (key, data) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', key.slice(0,32), iv)
    let encrypted = cipher.update(data, 'utf8', 'hex') //eslint-disable-line
    encrypted += cipher.final('hex') //eslint-disable-line
    return encrypted
}

const AES_decrypt = (key, data) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key.slice(0,32), iv)
    let decrypted = decipher.update(data, 'hex', 'utf8') //eslint-disable-line
    decrypted += decipher.final('utf8') //eslint-disable-line
    return decrypted
}

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex')

module.exports = {
    randomString,
    randomNumber,
    randomStringWithTimestamp,
    sha512,
    sha256,
    bcryptPassword,
    AES_encrypt,
    AES_decrypt,
    milliSecondsInOneWeek,
    md5,
    formatDateToDDMMYYYY
}
