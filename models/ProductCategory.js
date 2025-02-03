const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: String,
  fileImage: String
}, { timestamps: true });

module.exports = mongoose.model('ProductCategory', productSchema);