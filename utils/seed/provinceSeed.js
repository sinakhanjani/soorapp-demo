const mongoose = require('mongoose');
const Province = require('../../models/Province');
const provinceDB = require('../staticData/province');

mongoose.connection.on('connected', async () => {
  let provinces;
  try {
    provinces = await Province.find();
    if (provinces.length === 0) {
      await Province.insertMany(provinceDB);
    }
  } catch (err) {
    console.log(err);
  }
});
