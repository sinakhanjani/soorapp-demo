const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  _id: Number,
  title: String,
  body: String,
}, { timestamps: true });

module.exports = mongoose.model('Article', articleSchema);
