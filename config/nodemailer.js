const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "rg0804008", // generated ethereal user
        pass: "#Raghav2000", // generated ethereal password
    },
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    console.log("Data", data)
    ejs.renderFile(path.join(__dirname, "../views/mailers", relativePath), data, function (err, template) {
        if (err) {
            console.log("Error while rendering template", err);
            return;
        }
        console.log("Template", template)
        mailHTML = template
    })
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}

