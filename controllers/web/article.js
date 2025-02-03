const Admin = require('../../models/Admin');
const Article = require('../../models/Article');

const postRegister = (req, res) => {
  const { fullName, email, isManager } = req.body;
  const newAdmin = {
    fullName,
    email,
    isManager: (isManager === 'on'),
  };

  Admin.register(new Admin(newAdmin), req.body.password, (error, registeredAdmin) => {
    if (error || registeredAdmin === null) {
      req.flash('error', error.name);
      return res.redirect('/web/admin/new');
    }
    req.flash('success', 'کارشناس جدید با موفقیت اضافه شد');
    return res.redirect('/web/admin');
  });
};

const getRegisterPage = (req, res) => {
  res.render('./admin/new');
};

const getAdminPage = (req, res) => {
  Article.find({}, (error, foundAdmins) => {
    if (error) {
      req.flash('error', 'خطا در دریافت اطلاعات از سرور');
      return res.redirect('/web/');
    }
    return res.render('./article/index', { admins: foundAdmins });
  });
};

const getEditPage = (req, res) => {
  Article.findOne({ _id: req.params.adminID }, (error, foundAdmin) => {
    if (error || foundAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات');
      return res.redirect('/web');
    }
    return res.render('./article/edit', { admin: foundAdmin });
  });
};

const postUpdate = (req, res) => {
  const { body } = req.body;
  const updateAdminObj = {
    body
  };
 Article.findOneAndUpdate({ _id: req.params.adminID }, updateAdminObj, (error, foundAdmin) => {
    if (error || foundAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات');
      return res.redirect('/web/');
    }
    req.flash('success', 'تغییرات با موفقیت ذخیره شد.');
    return res.redirect(`/web/article/${req.params.adminID}`);
  });
};

const postDelete = (req, res) => {
  Admin.findOneAndDelete({ _id: req.params.adminID }, (error, deletedAdmin) => {
    if (error || deletedAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات، کارشناس حذف نشد.');
      return res.redirect('/web/admin');
    }
    req.flash('success', 'کارشناس با موفقیت حذف گردید');
    return res.redirect('/web/admin');
  });
};

const getChangePassword = (req, res) => res.render('./admin/password');

const postChangePassword = (req, res) => {
  if (req.body.new !== req.body.newRep) {
    req.flash('error', 'رمز عبور جدید و تکرار آن برابر نیستند');
    return res.redirect('/web/admin');
  }

  Admin.findById(req.user._id)
    .then((foundAdmin) => {
      foundAdmin.changePassword(req.body.old, req.body.new)
        .then(() => {
          req.flash('success', 'رمز عبور با موفقیت تغییر یافت');
          return res.redirect('/web/admin');
        })
        .catch((error) => {
          req.flash('error', error);
          return res.redirect('/web/admin');
        });
    })
    .catch(() => {
      req.flash('error', 'خطایی رخ داده است');
      return res.redirect('/web/admin');
    });
};

module.exports = {
  postRegister,
  getRegisterPage,
  getAdminPage,
  getEditPage,
  postUpdate,
  postDelete,
  getChangePassword,
  postChangePassword,
};
