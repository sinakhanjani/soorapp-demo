const mongoose = require('mongoose');

const provinceSchema = new mongoose.Schema({
  _id: Number,
  name: String,
}, { timestamps: true });

module.exports = mongoose.model('Province', provinceSchema);
