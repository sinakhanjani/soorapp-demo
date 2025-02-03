const mongoose = require('mongoose');

const verifySchema = new mongoose.Schema({
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  authCode: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Verify', verifySchema);
