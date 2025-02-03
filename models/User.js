const mongoose = require('mongoose');
const dataTables = require('mongoose-datatables');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: String,
  birthDate: String,
  email: String,
  province: {
    type: Number,
    ref: 'Province',
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  gender: {
    type: String,
    enum: ['M', 'F'], // accepts M or F
  },
  mobile: String,
  enabled: {
    type: Boolean,
    default: true,
  },
  fcmToken: String,
  country: {
    type: String,
    default: 'ایران',
  },
  photo: String,
}, { timestamps: true });

userSchema.plugin(dataTables);

module.exports = mongoose.model('User', userSchema);
