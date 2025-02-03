const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const utils = require('../utils');

const tokenAuth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      next('سرور با خطا مواجه شده است');
    } else if (!user) {
      next('شما مجاز به استفاده از این مسیر نیستید');
    }

    const token = utils.getToken(req.headers);
    if (!token) next('شما مجاز به استفاده از api نیستید. توکن با درخواست ارسال نشده است');

    try {
      jwt.verify(token, config.jwtSecret);
    } catch (err) { return next('توکن ارسال شده معتبر نمی باشد'); }

    req.user = user;
    req.userID = user._id;
    req.eventID = user.event;

    return next();
  })(req, res, next);
};

const webAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.currentAdmin = req.user;
    next();
  } else {
    // req.flash('warning', 'لطفا ابتدا وارد شوید');
    res.redirect('/web/login');
  }
};

module.exports = {
  tokenAuth,
  webAuth,
};
