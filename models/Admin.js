const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const adminSchema = mongoose.Schema({
  fullName: {
    type: String, required: true,
  },
  email: {
    type: String, required: true,
  },
  password: String,
  isManager: Boolean,
});

adminSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  limitAttempts: true,
  errorMessages: {
    MissingPasswordError: 'لطفا رمز عبور را وارد نمایید',
    AttemptTooSoonError: 'کاریر شما قفل شده است. لطفا بعدا تلاش نمایید',
    TooManyAttemptsError: 'کاربر شما به دلیل تلاش های ناموفق متوالی قفل شده است',
    NoSaltValueStoredError: 'ورود ناموفق بود. برای کاربر شما رمز عبور تعریف نشده است',
    IncorrectPasswordError: 'رمز عبور اشتباه است',
    IncorrectUsernameError: 'نام کاربری اشتباه است',
    MissingUsernameError: 'نام کاربری وارد نشده است',
    UserExistsError: 'این کاربر قبلا ثبت نام نموده است',
  },
});

module.exports = mongoose.model('Admin', adminSchema);
