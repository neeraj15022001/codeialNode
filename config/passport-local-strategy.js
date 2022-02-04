const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users_schema")
//Authentication using passport
//*******in the usernameField pass the name of email input tag**********
passport.use(new LocalStrategy({usernameField: "email", passReqToCallback: true}, function (req, email, password, done) {
//    find a user and establish the identity
            console.log("Using Local Strategy")
            User.findOne({email: email}, (err, user) => {
                    if (err) {
                        console.log("Error while retrieving user ----> Passport", err);
                        req.flash("error", err)
                        return done(err);
                    }
                    if (!user || user.password !== password) {
                        console.log("Invalid Username Password ---> Passport");
                        req.flash("error", "Invalid Username/Password")
                        return done(null, false, {message: "Invalid Username Password ---> Passport"});
                    } else {
                        console.log("Got User ----> Passport")
                        return done(null, user, {message: "Got User ----> Passport"});
                    }
                }
            )
        }
    )
);

//serialising user to decide which key to be kept in cookie
passport.serializeUser(function (user, done) {
    console.log("serializing users")
    done(null, user.id);
})
//deserializing the user from the key in the cookies
passport.deserializeUser(function (id, done) {
    console.log("deserializing user")
    User.findById(id, function (err, user) {
        if (err) {
            console.log("Error in finding user", err);
            return done(err);
        }
        console.log("Got User", user);
        return done(null, user);
    })
})

passport.checkAuthentication = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect("/users/login")
}

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user
    }
    next();
}

module.exports = passport;