const mongoose = require('mongoose');
const City = require('../../models/City');
const citiesDB = require('../staticData/city');

mongoose.connection.on('connected', async () => {
  let cities;
  try {
    cities = await City.find();
    if (cities.length === 0) {
      await City.insertMany(citiesDB);
    }
  } catch (err) {
    console.log(err);
  }
});
