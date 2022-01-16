const User = require("../models/users_schema")
module.exports.profile = (req, res) => {
    return res.send("<h1>User Profile</h1>");
}

module.exports.about = (req, res) => {
    return res.send("<h1>Rendering user about page</h1>");
}

//render login page
module.exports.login = (req, res) => {
    console.log(req.cookies)
    return res.render('login', {layout: false, title: "Login"});
}

//render signup page
module.exports.signup = (req, res) => {
    return res.render('signup', {layout: false, title: "Signup"});
}

//create user
module.exports.create = (req, res) => {
    const user = req.body
    if (user.userpassword !== user.userconfirmpassword) {
        return res.redirect('back')
    }
    User.findOne({email: user.useremail}, (err, data) => {
        if (err) {
            console.log("Cannot while checking for user", err);
            return;
        }
        if (!data) {
            User.create({
                email: user.useremail,
                password: user.userpassword,
                name: user.username
            }, function (err, data) {
                if (err) {
                    console.log("Error while creating user", err);
                    return;
                }
                console.log("User created successfully", data);
                return res.redirect("/")
            })
        } else {
            return res.redirect("/");
        }

    })
}
//create user session
module.exports.createSession = (req, res) => {
//    TODO
}