const queues = require("../config/bull");
const commentsMailer = require("../mailers/comments_mailer");
queues.emailQueue.process("emails",async function(job, done) {
    console.log("Email workers is processing a job", job.data);
    await commentsMailer.newComment(job.data);
    done();
});