const nodemailer = require("../config/nodemailer");

module.exports.newComment = async (comment) => {
    console.log("inside new comment mailer", comment);
    let htmlString = nodemailer.renderTemplate({comment: comment}, "/comments/new_comment.ejs")
    await nodemailer.transporter.sendMail({
        from: '"Raghav Garg 👻" <rg0804008@gmail.com>', // sender address
        to: comment.user.email, // list of receivers
        subject: "User Commented", // Subject line
        html: htmlString
    }, (err, info) => {
        if (err) {
            console.log("Error while sending mail", err);
            return;
        }
        console.log("Email Sent", info);
        return;
    });
}