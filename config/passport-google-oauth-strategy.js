const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("../models/users_schema");
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
    clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({email: profile.emails[0].value}).exec(function (err, user) {
        if (err) {
            console.log("Error in finding user -----> Google", err);
            return;
        }
        console.log(profile)
        if (user) {
            return done(null, user);
        } else {
            User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            }, function (err, user) {
                if (err) {
                    console.log("Error in creating google user ----> Google", err);
                    return;
                }
                return done(null, user);
            })
        }
    })
}))
module.exports = passport
