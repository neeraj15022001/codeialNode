const User = require("../models/users_schema")
module.exports.profile = (req, res) => {
    return res.send("<h1>User Profile</h1>");
}

module.exports.about = (req, res) => {
    return res.send("<h1>Rendering user about page</h1>");
}

//render login page
module.exports.login = (req, res) => {
    return res.render('login', {layout: false, title: "Login"});
}

//render signup page
module.exports.signup = (req, res) => {
    return res.render('signup', {layout: false, title: "Signup"});
}

//create user
module.exports.create = (req, res) => {
    const user = req.body
    console.log(user)
    if (user.password !== user.confirm_password) {
        return res.redirect('back')
    }
    User.findOne({email: user.email}, (err, data) => {
        if (err) {
            console.log("Cannot while checking for user", err);
            return;
        }
        if (!data) {
            User.create(req.body, function (err, data) {
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
    console.log("login ---> ", req.body)
    return res.redirect("/")
}