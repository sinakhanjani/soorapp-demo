const Admin = require('../../models/Admin');
const Product = require('../../models/Product');
const ProductCategory = require('../../models/ProductCategory');
const moment = require('moment');

const postRegister = async (req, res) => {
  const {
    categoryId,
    title,
    description,
    dateStart,
    dateEnd,
    phone,
    mobile,
    instagram,
    telegram,
    site,
    lat,
    lng
  } = req.body;

  // fileImage,
  // fileVideo,
  // fileImages
  let files = req.files;
  let fileImage = files.filter(x => x.fieldname == 'fileImage')[0];
  let fileVideo = files.filter(x => x.fieldname == 'fileVideo')[0];
  let fileImages = files.filter(x => x.fieldname.indexOf('fileImages') >= 0);

  fileImage = (fileImage) ? fileImage.filename : '';
  fileVideo = (fileVideo) ? fileVideo.filename : '';
  fileImagesList = [];
  for(const item of fileImages) {
    fileImagesList.push(item.filename);
  }

  const newMember = new Product({
    categoryId,
    title,
    description,
    dateStart,
    dateEnd,
    phone,
    mobile,
    instagram,
    telegram,
    site,
    lat,
    lng,
    fileImage,
    fileVideo,
    fileImages: fileImagesList
  });

  await newMember.save().then((registeredAdmin) => {
    req.flash('success', 'خدمت جدید با موفقیت اضافه شد');
    return res.redirect('/web/product');
  }).catch((error) => {
    req.flash('error', error.name);
    return res.redirect('/web/product/new');
  });

};

const getRegisterPage = (req, res) => {
  ProductCategory.find({}, async (error, foundAdmins) => {
    if (error) {
      req.flash('error', 'خطا در دریافت اطلاعات از سرور');
      return res.redirect('/web/');
    }
    console.log('--> ', foundAdmins);
    return res.render('./product/new', { admins: foundAdmins });
  });
};

const getAdminPage = (req, res) => {
  Product.find({}, async (error, foundAdmins) => {
    if (error) {
      req.flash('error', 'خطا در دریافت اطلاعات از سرور');
      return res.redirect('/web/');
    }
    let records = [];
    for (let item of foundAdmins) {
      let pc = await ProductCategory.findOne({ _id: item.categoryId });

      item.categoryTitle = (pc) ? pc.title : '';

      // Date Check
      let myDate1 = item.dateStart;
      let dateSplitted1 = myDate1.split("/");
      jD1 = JalaliDate.jalaliToGregorian( dateSplitted1[0], dateSplitted1[1], dateSplitted1[2] ),
      dateFrom = jD1[0] + "/" + jD1[1] + "/" + jD1[2];

      let myDate2 = item.dateEnd;
      let dateSplitted2 = myDate2.split("/");
      jD2 = JalaliDate.jalaliToGregorian( dateSplitted2[0], dateSplitted2[1], dateSplitted2[2] ),
      dateTo = jD2[0] + "/" + jD2[1] + "/" + jD2[2];

      var dateObj = new Date();
      var month = dateObj.getUTCMonth() + 1; //months from 1-12
      var day = dateObj.getUTCDate();
      var year = dateObj.getUTCFullYear();
      let dateCheck = year + "/" + month + "/" + day;

      item.isValid = moment(dateCheck).isBetween(dateFrom, dateTo);

      records.push(item);
    }

    let category = [];
    category = await ProductCategory.find({}, async (error, resCat) => {
      if (error) {
        req.flash('error', 'خطا در دریافت اطلاعات از سرور');
        return res.redirect('/web/');
      }
      return resCat;
    });

    return res.render('./product/index', { data: {records, category} });
  });
};

const getEditPage = (req, res) => {
  Product.findOne({ _id: req.params.adminID }, (error, foundAdmin) => {
    if (error || foundAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات');
      return res.redirect('/web');
    }
    return res.render('./product/edit', { admin: foundAdmin });
  });
};

const postUpdate = (req, res) => {
  const {
    title,
    description,
    dateStart,
    dateEnd,
    phone,
    mobile,
    instagram,
    telegram,
    site,
    lat,
    lng
  } = req.body;

  let files = req.files;
  let fileImage = files.filter(x => x.fieldname == 'fileImage')[0];
  let fileVideo = files.filter(x => x.fieldname == 'fileVideo')[0];
  let fileImages = files.filter(x => x.fieldname.indexOf('fileImages') >= 0);

  fileImage = (fileImage) ? fileImage.filename : undefined;
  fileVideo = (fileVideo) ? fileVideo.filename : undefined;
  fileImagesList = [];
  for(const item of fileImages) {
    fileImagesList.push(item.filename);
  }

  const updateAdminObj = {
    title,
    description,
    dateStart,
    dateEnd,
    phone,
    mobile,
    instagram,
    telegram,
    site,
    lat,
    lng,
    fileImage,
    fileVideo,
    fileImages: fileImagesList
  };

  Product.findOneAndUpdate({ _id: req.params.adminID }, updateAdminObj, (error, foundAdmin) => {
    if (error || foundAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات');
      return res.redirect('/web/');
    }
    req.flash('success', 'تغییرات با موفقیت ذخیره شد.');
    return res.redirect(`/web/product/${req.params.adminID}`);
  });
};

const postDelete = (req, res) => {
  Product.findOneAndDelete({ _id: req.params.adminID }, (error, deletedAdmin) => {
    if (error || deletedAdmin === null) {
      req.flash('error', 'خطا در دریافت اطلاعات، خدمت حذف نشد.');
      return res.redirect('/web/product');
    }
    req.flash('success', 'خدمت با موفقیت حذف گردید');
    return res.redirect('/web/product');
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


// Date

JalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29]
};

JalaliDate.jalaliToGregorian = function(j_y, j_m, j_d) {
  j_y = parseInt(j_y);
  j_m = parseInt(j_m);
  j_d = parseInt(j_d);
  var jy = j_y - 979;
  var jm = j_m - 1;
  var jd = j_d - 1;

  var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt((jy % 33 + 3) / 4);
  for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

  j_day_no += jd;

  var g_day_no = j_day_no + 79;

  var gy = 1600 + 400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */
  {
      g_day_no--;
      gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
      g_day_no = g_day_no % 36524;

      if (g_day_no >= 365) g_day_no++;
      else leap = false;
  }

  gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
      leap = false;

      g_day_no--;
      gy += parseInt(g_day_no / 365);
      g_day_no = g_day_no % 365;
  }

  for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
  g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
  var gm = i + 1;
  var gd = g_day_no + 1;

  gm = gm < 10 ? "0" + gm : gm;
  gd = gd < 10 ? "0" + gd : gd;

  return [gy, gm, gd];
}
