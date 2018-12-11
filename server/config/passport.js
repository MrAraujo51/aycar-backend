const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../user/user.server.model');
const config = require('./config');

module.exports = (passport) => {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = config.privateKey;
    passport.use(new JwtStrategy(opts, (jwt_paload, done) => {
        User.findOne({_id: jwt_paload._id}, (err,user) => {
            if (err) {
                return done(new Error("uncaught error! try again later"), false);
            }

            if (user) {
                return done(null, user);
            } else {
                return done(new Error("User not found"), false);
            }
        });
    }));
}