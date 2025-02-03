const isAdmin = (req, res, next) => {
  if (req.user.isManager) {
    next();
  } else {
    req.flash('warning', 'شما به این قسمت دسترسی ندارید.');
    return res.redirect('/web/');
  }
};

module.exports = isAdmin;
