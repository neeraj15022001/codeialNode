const User = require("../models/users_schema");
const ResetUser = require("../models/reset-user-schema");
const crypto = require("crypto")
const fs = require("fs")
const path = require("path")
const queues = require("../config/bull");
const resetPassswordWorker = require("../workers/reset_password_worker")
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

                    if (user.avatar) {
                        if (fs.existsSync(path.join(__dirname, "..", user.avatar)))
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

//render forgot password page
module.exports.reset = (req, res) => {
    return res.render('forgot_password', {title: "Forgot Password"})
}

module.exports.sendLink = async (req, res) => {
    const requestedEmail = req.body.forgotPassword;
    try {
        let user = await User.findOne({email: requestedEmail});
        console.log("User found for resetting password", user);
        try {
            let resetUser = await ResetUser.create(
                {
                    "accessToken": crypto.randomBytes(20).toString('hex'),
                    "isValid": true,
                    "user": user._id
                }
            );
            try {
                const job = await queues.resetPasswordQueue.add('reset-password', resetUser);
                console.log("Job Created", job.id);
                return res.redirect('back');
            } catch (e) {
                console.log("Error while adding to queue", e);
                return res.redirect("back");
            }
        } catch (e) {
            console.log("Error while creating reset user", e);
            return res.redirect("back")
        }
    } catch (e) {
        console.log("Error while finding user for resetting password", e);
        return res.redirect("back");
    }
}

//change password
module.exports.changePassword = async (req, res) => {
    let accessTokenQuery = req.query.accessToken
    try {
        let resetUserDB = await ResetUser.findOne({accessToken: accessTokenQuery}).populate("user");
        if(!resetUserDB.isValid) {
            return res.redirect("/users/forgot-password");
        }
        resetUserDB.isValid = false;
        await resetUserDB.save()
        const currentUser = resetUserDB.user;
        resetUserDB.remove();
        return res.render("change-password", {title: "Change Password", resetUser: currentUser})
    } catch (e) {
        console.log("Error while verifying access token", e);
        return res.redirect("/users/forgot-password");
    }
}
// update Password
module.exports.updatePassword = async (req, res) => {
    let user = req.body;
    if(user.password !== user.confirmPassword) {
        return res.redirect("back");
    }
    try {
        let userFromDB = await User.findOne({email: user.email});
        userFromDB.password = user.password;
        userFromDB.save();
        return res.redirect("/users/login");
    } catch (e) {
        console.log("Error Finding User")
    }
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
    console.log("Local Strategy created session")
    req.flash('success', 'Logged In Successfully')
    return res.redirect(`/users/profile/${req.user.id}`)
}
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'You Have Logged Out')
    return res.redirect("/users/login");
}