/*

Ref link for how to register a job with given frequency

https://github.com/node-schedule/node-schedule

-------------------------------------------------------------------

Cron format guide

*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

*/


const schedule = require('node-schedule')
const co = require('co')
const R = require('ramda')
const jobs = require('./schedulerJobs')

// -------------------------------------------------------------------

function executeJob(job) { //eslint-disable-line
    console.log(String(new Date()), ' => ', 'Job Started', ' => ', job.name) //eslint-disable-line
    co(job)
        .then(() => console.log(String(new Date()), ' => ', 'Job Successful', ' => ', job.name)) //eslint-disable-line
        .catch((err) => console.error(String(new Date()), ' => ', 'Job Failed', ' => ', job.name, err)) //eslint-disable-line
}

function registerJob(frequency, job) { //eslint-disable-line
    if (R.isNil(job) || R.isEmpty(job.name) || !R.equals(job.name, R.toUpper(job.name)))
        throw new Error('Please provide name for Job function in uppercase') //eslint-disable-line
    console.log(String(new Date()), ' => ', 'Job Registered', ' => ', job.name) //eslint-disable-line
    schedule.scheduleJob(frequency, () => executeJob(job))
    // call job immediately on start up
    setTimeout(() => executeJob(job))
}

// -------------------------------------------------------------------
// Register new jobs here

registerJob('0 0 0 * * *', jobs.TEST_SCHDEULER) // this will run everyday at 00:00a.m

//--------------------------------------------------------------------
