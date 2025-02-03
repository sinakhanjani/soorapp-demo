const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  categoryId: String,
  title: String,
  description: String,
  dateStart: String,
  dateEnd: String,
  phone: String,
  mobile: String,
  instagram: String,
  telegram: String,
  site: String,
  lat: String,
  lng: String,
  fileImage: String,
  fileVideo: String,
  fileImages: [String]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);