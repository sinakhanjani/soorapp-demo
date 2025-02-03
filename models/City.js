const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
  name: String,
  province: {
    ref: 'Province',
    type: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('City', citySchema);
