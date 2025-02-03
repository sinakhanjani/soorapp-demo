const { errorLogger } = require('../helpers/Logger');

module.exports = {
  api: (err, req, res, next) => {
    errorLogger(err);
    if (res.headersSent) return next(err);
    return res.json({ status: false, message: err.message || err });
  },
  web: (err, req, res, next) => {
    errorLogger(err);
    if (res.headersSent) return next(err);
    req.flash('error', err.message || err);
    return res.redirect('back');
  },
};
