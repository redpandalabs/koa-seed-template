const jobs = {}

jobs.TEST_SCHDEULER = function* TEST_SCHDEULER() { //eslint-disable-line
    try {
        yield {}
        console.log('Perform any operations here in the schdeules.') //eslint-disable-line

    } catch(err) {
        console.error('Error Occured : ', err) //eslint-disable-line
    }
}

module.exports = jobs
