const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/users_schema")
//Authentication using passport
passport.use(new LocalStrategy({usernameField: "email"}, function (email, password, done) {
//    find a user and establish the identity
            console.log(email, password)
            User.findOne({email: email}, (err, user) => {
                    if (err) {
                        console.log("Error while retrieving user ----> Passport", err);
                        return done(err);
                    }
                    if (!user || user.password !== password) {
                        console.log("Invalid Username Password ---> Passport");
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

module.exports = passport;