const queues = require("../config/bull");
const resetPasswordMailer = require("../mailers/reset_password_mailer");
queues.resetPasswordQueue.process("reset-password", async function (job, done) {
    console.log("Reset Password queue is processing job", job.data)
    await resetPasswordMailer.newResetEmail(job.data)
    done();
})