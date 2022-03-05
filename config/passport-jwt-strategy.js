const passport = require("passport")
let JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require("../models/users_schema")
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET_KEY;
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("jwt payload", jwt_payload.sub, jwt_payload)
    User.findOne({_id: jwt_payload._id}, function (err, user) {
        if (err) {
            return done(err)
        }
        if (user) {
            console.log("User from strategy jwt ---> ", user)
            return done(null, user);
        } else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
module.exports = passport