const jwtPassport = require('passport-jwt');
const config = require('../../config/config');
const User = require('../../models/User');

const options = {
  jwtFromRequest: jwtPassport.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret,
};

const strategy = new jwtPassport.Strategy(options, ((payload, done) => {
  User.findOne({ _id: payload.userID }, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    return done(null, false);
  });
}));

module.exports = strategy;
