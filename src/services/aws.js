const AWS = require('aws-sdk')
const config = require('../../config')
const fs = require('fs')


AWS.config.setPromisesDependency(null) //eslint-disable-line
AWS.config.update({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACESSS_KEY,
    region: config.AWS_S3_REGION
})

const s3 = new AWS.S3({
    params: {
        Bucket: config.AWS_S3_BUCKET
    }
})

const uploadImage = function(key, filePath) {
    const readStream = fs.createReadStream(filePath) //eslint-disable-line
    const params = {
        Key: key,
        Body: readStream
    }
    return s3.putObject(params).promise()
}

module.exports = {
    uploadImage: uploadImage
}
