const Queue = require('bull');
const emailQueue = new Queue('emails');
module.exports = emailQueue
