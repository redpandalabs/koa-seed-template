const mongoose = require('mongoose')
const config = require('../../config')

/* eslint-disable */
mongoose.Promise = global.Promise
const __setOptions = mongoose.Query.prototype.setOptions
mongoose.Query.prototype.setOptions = function() {
    __setOptions.apply(this, arguments)
    this._mongooseOptions.lean = true
    return this
}
/* eslint-enable */

mongoose.connect(config.MONGO_URL, {
    db: {
        native_parser: true
    },
    server: {
        poolSize: config.MONGO_POOL_SIZE
    }
})
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: String,
    encryptedPassword: String,
    passwordResetCode: String,
    registrationTime: {
        type: Number,
        default: Date.now
    }
}, {
    versionKey: false
})

module.exports = {
    user: mongoose.model('user', userSchema)
}
