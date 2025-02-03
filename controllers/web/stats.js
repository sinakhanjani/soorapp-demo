const User = require('../../models/User');

async function getGenders() {
  const genders = await User.aggregate([
    { $group: { _id: '$gender', count: { $sum: 1 } } },
  ]);
  genders.forEach((gender) => {
    if (gender._id === 'F') {
      gender.name = 'زن';
    } else if (gender._id === 'M') {
      gender.name = 'مرد';
    } else {
      gender.name = 'مشخص نشده';
    }
  });
  return genders;
}

function getProvinces() {
  return User.aggregate([
    { $group: { _id: '$province', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'provinces',
        localField: '_id',
        foreignField: '_id',
        as: '_id',
      },
    },
    { $unwind: '$_id' },
    {
      $project: {
        _id: 0,
        name: '$_id.name',
        count: 1,
      },
    },
  ]);
}

function getCities() {
  return User.aggregate([
    { $group: { _id: '$city', count: { $sum: 1 } } },
    {
      $lookup: {
        from: 'cities',
        localField: '_id',
        foreignField: '_id',
        as: '_id',
      },
    },
    { $unwind: '$_id' },
    {
      $lookup: {
        from: 'provinces',
        localField: '_id.province',
        foreignField: '_id',
        as: 'province',
      },
    },
    { $unwind: '$province' },
    {
      $project: {
        _id: 0,
        name: '$_id.name',
        province: '$province.name',
        count: 1,
      },
    },
  ]);
}

const getStats = async (req, res, next) => {
  try {
    const data = await Promise.all([
      await getProvinces(),
      await getCities(),
      await getGenders(),
    ]);

    return res.render('./stats/index', { provinces: data[0], cities: data[1], genders: data[2] });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getStats,
};
