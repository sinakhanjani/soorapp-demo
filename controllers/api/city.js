const City = require('../../models/City');

const getCities = async (req, res, next) => {
  try {
    const cities = await City.find({ province: req.query.provinceId });
    if (cities.length === 0) return next('شهرستانی برای این استان در سامانه ثبت نشده است');

    return res.json({ status: true, cities });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCities,
};
