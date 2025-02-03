const Admin = require('../../models/Admin');
const ProductCategory = require('../../models/ProductCategory');

const postRegister = async (req, res) => {
  const { title } = req.body;
  const fileImage = req.file.filename;

  const newMember = new ProductCategory({
    title,
    fileImage
  });

  await newMember.save().then((registeredAdmin) => {
    req.flash('success', 'دسته بندی جدید با موفقیت اضافه شد');
    return res.redirect('/web/productCategory');
  }).catch((error) => {
    req.flash('error', error.name);
    return res.redirect('/web/productCategory/new');
  });

};

const getRegisterPage = (req, res) => {
  res.render('./productCategory/new');
};

const getAdminPage = (req, res) => {
  ProductCategory.find({}, (error, foundAdmins) => {
    if (error) {
      req.flash('error', 'خطا در دریافت اطلاعات از سرور');
      return res.redirect('/web/');
    }
    return res.render('./productCategory/index', { admins: foundAdmins });
  });
};

const getEditPage = (req, res) => {
  ProductCategory.findOne({ _id: req.params.adminID }, (error, foundAdmin) => {
    if (error || foundAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات');
      return res.redirect('/web');
    }
    return res.render('./productCategory/edit', { admin: foundAdmin });
  });
};

const postUpdate = (req, res) => {
  const { title } = req.body;
  const file = req.file;
  let fileImage = (file) ? file.filename : undefined;
  
  const updateAdminObj = {
    title,
    fileImage
  };

  ProductCategory.findOneAndUpdate({ _id: req.params.adminID }, updateAdminObj, (error, foundAdmin) => {
    if (error || foundAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات');
      return res.redirect('/web/');
    }
    req.flash('success', 'تغییرات با موفقیت ذخیره شد.');
    return res.redirect(`/web/productCategory/${req.params.adminID}`);
  });
};

const postDelete = (req, res) => {
  ProductCategory.findOneAndDelete({ _id: req.params.adminID }, (error, deletedAdmin) => {
    if (error || deletedAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات، دسته بندی حذف نشد.');
      return res.redirect('/web/productCategory');
    }
    req.flash('success', 'دسته بندی با موفقیت حذف گردید');
    return res.redirect('/web/productCategory');
  });
};

module.exports = {
  postRegister,
  getRegisterPage,
  getAdminPage,
  getEditPage,
  postUpdate,
  postDelete
};
