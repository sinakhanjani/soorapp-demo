const passport = require('passport');

const postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { return next(err); }
    if (!user) {
      req.flash('error', info.name);
      return res.redirect('/web/login');
    }

    req.logIn(user, (error) => {
      if (error) { return next(error); }
      return res.redirect('/index');
    });
  })(req, res, next);
};

const getLogOut = (req, res) => {
  req.logout();
  req.flash('success', 'خروج با موفقیت صورت گرفت');
  res.redirect('/web/login');
};

const getLoginPage = (req, res) => {
  res.render('./login/login');
};

module.exports = {
  getLoginPage,
  postLogin,
  getLogOut,
};
