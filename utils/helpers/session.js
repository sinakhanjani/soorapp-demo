const mongoose = require('mongoose');
const expSession = require('express-session');
const MongoStore = require('connect-mongo')(expSession);
const { sessionSecret } = require('../../config/config');

module.exports = expSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    touchAfter: 24 * 3600,
  }),
});
