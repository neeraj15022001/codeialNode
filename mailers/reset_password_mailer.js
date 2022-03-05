const nodemailer = require("../config/nodemailer");
const ResetUser = require("../models/reset-user-schema")
module.exports.newResetEmail = async (resetUser) => {
    console.log("inside new reset link mailer", resetUser);
    try {
        let searchedUser = await ResetUser.findById(resetUser._id).populate("user");
        console.log("Searched User", searchedUser);
        let htmlString = nodemailer.renderTemplate({resetUser: searchedUser}, "/reset-password/reset-password.ejs");
        await nodemailer.transporter.sendMail({
            from: '"Raghav Garg" <rg0804008@gmail.com>', // sender address
            to: searchedUser.user.email, // list of receivers
            subject: "Codeial Password Reset Link", // Subject line
            html: htmlString
        }, (err, info) => {
            if (err) {
                console.log("Error while sending mail", err);
                return;
            }
            console.log("Email Sent", info);
            return;
        })
    } catch (e) {
        console.log("Error while finding reset user", e);
    }
}