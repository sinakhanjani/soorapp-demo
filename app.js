require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');

const app = express();
const router = require('./router');
const { uploadDirectory } = require('./config/config');
const createDirectory = require('./utils/uploadDirectoryCreation');
const session = require('./utils/helpers/session');
const flashMiddleware = require('./utils/helpers/flashMiddleware');
const jwtStrategy = require('./utils/helpers/JwtHelper');
const Admin = require('./models/Admin');

// no catch block, if the function fails we must exit.
createDirectory(uploadDirectory);
createDirectory('./csv');

// DB seeds
require('./utils/seed/articleSeed');
require('./utils/seed/provinceSeed');
require('./utils/seed/citySeed');

// notification and state update jobs
require('./utils/agenda/agenda');

app.use(session);

app.set('view engine', 'ejs');
app.use(flash());
app.use(flashMiddleware);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('files'));
app.use(passport.initialize());
app.use(passport.session());

router(app);

// passport middlewares
passport.use(jwtStrategy);

// use static authenticate method of model in LocalStrategy
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

module.exports = app;
