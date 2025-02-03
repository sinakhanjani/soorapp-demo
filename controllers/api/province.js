const Province = require('../../models/Province');

const getProvinces = async (req, res, next) => {
  try {
    const provinces = await Province.find({});
    if (provinces.length === 0) return next('استانی در سامانه ثبت نشده است');

    return res.json({ status: true, provinces });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getProvinces,
};
