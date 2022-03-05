const Queue = require('bull');
const emailQueue = new Queue('emails');
const resetPasswordQueue = new Queue('reset-password')
module.exports = {emailQueue: emailQueue, resetPasswordQueue: resetPasswordQueue}

