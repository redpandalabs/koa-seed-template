'use strict'
const _ = require('ramda')

const Config = {
    PORT: 3000,
    APP_URL: '',
    SERVER_URL: '',
    MONGO_URL: 'mongodb://localhost/test',
    MONGO_POOL_SIZE : 10,
    AWS_ACCESS_KEY_ID: '',
    AWS_SECRET_ACESSS_KEY: '',
    AWS_S3_BUCKET_URL: '',
    AWS_S3_REGION: '',
    AWS_S3_BUCKET: '',
    AWS_PICTURE_URL: '',
    SENDGRID_API_KEY: '',
    AUTHENTICATION_RANDOM_KEY: 'k3Jcd6Za',
}

const Stage = _.merge(Config, {
    APP_URL: '',
    SERVER_URL: '',
})

const Prod = _.merge(Config, {
    APP_URL: '',
    SERVER_URL: '',
})

module.exports = (function() {  //eslint-disable-line fp/no-nil

    switch (process.env.NODE_ENV) {
    case 'prod':
        console.log('Starting server in Prod profile') //eslint-disable-line no-console
        return Prod
    case 'stage':
        console.log('Starting server in Stage profile') //eslint-disable-line no-console
        return Stage
    default:
        console.log('Starting server in Dev profile') //eslint-disable-line no-console
        // TODO: If this falg is not set, we get UNABLE_TO_VERIFY_LEAF_SIGNATURE error when we hit YCS service URL. Will remove this later...
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0' //eslint-disable-line fp/no-mutation
        // ----
        return Config
    }
})()
