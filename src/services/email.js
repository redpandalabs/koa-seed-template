const config = require('../../config')
const sendgrid = require('sendgrid')(config.SENDGRID_API_KEY)
const helper = require('sendgrid').mail
const _ = require('ramda')
const handlebars = require('handlebars')
const fs = require('fs')

const email = {}

const templateMap = {
    'WELCOME': {
        subject: 'Wecome to Red Panda',
        path: '/emailTemplates/welcome.html'
    }
}

email._validate = (emails) => { //eslint-disable-line
    if (!_.is(Array, emails))
        throw new Error('Please provide array of email address') //eslint-disable-line
    if (_.isEmpty(emails))
        throw new Error('Array of emails should not be empty') //eslint-disable-line
    if(emails.indexOf('') === 1)
        throw new Error('Array should not have blank values') //eslint-disable-line
}

email._validateParams = (params) => { //eslint-disable-line

    if (!_.is(Array, params))
        throw new Error('Please provide array of params') //eslint-disable-line

    const check = (param) => { //eslint-disable-line
        if (_.not(_.equals('object', typeof(param)))){
            throw new Error('Params should be an object') //eslint-disable-line
        }else{
            return true
        }
    }

    if (_.not(_.isEmpty(params)))
        _.map(check, params)
}

email._buildEmailData = (templateType, receivers, params) => { //eslint-disable-line

    const mail = new helper.Mail()
    const personalization = new helper.Personalization()

    const emailData = templateMap[templateType] //eslint-disable-line
    const templateContent = fs.readFileSync(__dirname.concat(emailData.path)) //eslint-disable-line
    const template = handlebars.compile(_.toString(templateContent))
    const addReceivers = (e) => { //eslint-disable-line
        const email = new helper.Email(e, '')
        personalization.addTo(email)
    }
    _.map(addReceivers, receivers)

    const substituteParams = (content) => template(content)
    const emailContent = _.isEmpty(params) ? _.toString(templateContent) : _.map(substituteParams, params)
    const content = _.isEmpty(params) ? new helper.Content('text/html', emailContent) : new helper.Content('text/html', _.head(emailContent))

    mail.addContent(content)
    mail.setFrom({email: 'surveys@kokonetworks.com', name: 'Koko Surveys'})
    mail.setSubject(emailData.subject)
    mail.addPersonalization(personalization)

    return mail
}

email.sendEmail = (templateType, receivers, params) => { //eslint-disable-line
    email._validate(receivers)
    email._validateParams(params)

    return new Promise((resolve,reject) => { //eslint-disable-line

        const mail = email._buildEmailData(templateType, receivers, params)
        const request = sendgrid.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON()
        })

        sendgrid.API(request, function(err, response) { //eslint-disable-line
            if (response.statusCode === 202){
                resolve(response)
            }
            else{
                reject(err)
                console.error(response.body.errors) //eslint-disable-line
            }
        })
    })
}

module.exports = email
