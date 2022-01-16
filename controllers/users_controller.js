const User = require("../models/users_schema")
module.exports.profile = (req, res) => {
    if (req.cookies.user_id) {
        User.findById(req.cookies.user_id, (err, user) => {
            if (err) {
                console.log("Error finding user", err);
                return res.redirect("/user/login")
            } else {
                if (user) {
                    return res.render("profile", {title: "User Profile", user: user
                    })
                } else {
                    return res.redirect("/users/login")
                }
            }
        })
    } else {
        return res.redirect("/users/login")
    }
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
    const userSigningIn = req.body;
    User.findOne({email: userSigningIn.useremail}, function (err, user) {
            if (err) {
                console.log("Error finding user", err);
                return;
            }
            if (user) {
                if (user.password != userSigningIn.userpassword) {
                    return res.redirect("back")
                } else {
                    res.cookie("user_id", user.id)
                    return res.redirect("/users/profile")
                }
            } else {
                return res.redirect('back');
            }
        }
    )
}