const moment = require('moment');
const ProductCategory = require('../../models/ProductCategory');
const Product = require('../../models/Product');

const getProductCategorys = async (req, res, next) => {
  try {
    const cities = await ProductCategory.find();
    if (cities.length === 0) return next('شهرستانی برای این استان در سامانه ثبت نشده است');

    return res.json({ status: true, cities });
  } catch (err) {
    return next(err);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const product = await Product.find({categoryId: req.query.id});
    if (!product) return next('خالیه');

    let records = [];
    for (let item of product) {
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

      let isValid = moment(dateCheck).isBetween(dateFrom, dateTo);
      let newItem = {
        _id: item._id,
        categoryId: item.categoryId,
        title: item.title,
        description: item.description,
        dateStart: item.dateStart,
        dateEnd: item.dateEnd,
        phone: item.phone,
        mobile: item.mobile,
        instagram: item.instagram,
        telegram: item.telegram,
        site: item.site,
        lat: item.lat,
        lng: item.lng,
        fileImage: item.fileImage,
        fileVideo: item.fileVideo,
        fileImages: item.fileImages,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        __v: item.__v,
        isValid: isValid
      };

      records.push(newItem);
    }

    let tempRandom = [];
    let len = records.length;

    for (let i = 0; i < len; i++) {
      const rnd = Math.floor(Math.random() * records.length);
      tempRandom.push(records[rnd]);
      records.splice(rnd, 1);
    }

    records = tempRandom;

    return res.json({ status: true, records });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getProductCategorys,
  getProducts
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
