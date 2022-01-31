const User = require("../models/users_schema")
const fs = require("fs")
const path = require("path")
module.exports.profile = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        return res.render("profile", {title: "User Profile", profile_user: user});
    })
}

module.exports.update = async (req, res) => {

    if (req.user.id == req.params.id) {
        try {
            let user = await User.findByIdAndUpdate(req.params.id, req.body);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log("******Multer Error", err)
                }
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {

                    if(user.avatar) {
                        //TODO: check if file is also present in directory before removing
                        fs.unlinkSync(path.join(__dirname, "..", user.avatar))
                    }

                    user.avatar = User.avatarPath + "/" + req.file.filename
                }
                user.save()
                console.log(req.file)
                return res.redirect("back")
            })
        } catch (e) {
            req.flash('error', e);
            return res.redirect("back");
        }
    } else {
        req.flash('error', "Unauthorized");
        return res.status(401).send("Unauthorized")
    }
}

module.exports.about = (req, res) => {
    return res.send("<h1>Rendering user about page</h1>");
}

//render login page
module.exports.login = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect(`/users/profile/${req.user.id}`)
    }
    return res.render('login', {title: "Login"});
}

//render signup page
module.exports.signup = (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect(`/users/profile/${req.user.id}`)
    }
    return res.render('signup', {title: "Signup"});
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
    req.flash('success', 'Logged In Successfully')
    return res.redirect(`/users/profile/${req.user.id}`)
}
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You Have Logged Out')
    return res.redirect("/users/login");
}