const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const generateUserToken = (userID) => jwt.sign({ userID }, config.jwtSecret);

const getToken = function (headers) {
  if (headers && headers.authorization) {
    const parted = headers.authorization.split(' ');
    if (parted.length === 2) return parted[1];
  }
  return null;
};

const generateAuthCode = () => {
  let authCode = 1;
  while (authCode < 1000) {
    authCode = Math.floor(Math.random() * 10000);
  }
  return authCode;
};

const getNowInString = function () {
  // 2016-05-16-09-50-20
  const d = new Date();
  return `${d.getFullYear()}-${(`0${d.getMonth() + 1}`).slice(-2)}-${
    (`0${d.getDate()}`).slice(-2)}-${(`0${d.getHours()}`).slice(-2)}-${
    (`0${d.getMinutes()}`).slice(-2)}-${(`0${d.getSeconds()}`).slice(-2)}`;
};

const translateError = function (infoObj) {
  const errorMessages = {
    MissingPasswordError: 'لطفا رمز عبور را وارد نمایید',
    AttemptTooSoonError: 'کاریر شما قفل شده است. لطفا بعدا تلاش نمایید',
    TooManyAttemptsError: 'کاربر شما به دلیل تلاش های ناموفق متوالی قفل شده است',
    NoSaltValueStoredError: 'ورود ناموفق بود. برای کاربر شما رمز عبور تعریف نشده است',
    IncorrectPasswordError: 'رمز عبور اشتباه است',
    IncorrectUsernameError: 'نام کاربری اشتباه است',
    MissingUsernameError: 'نام کاربری وارد نشده است',
    UserExistsError: 'این کاربر قبلا ثبت نام نموده است',
  };

  return errorMessages[infoObj.name];
};

// const respond = function (resObj, status, res) {
//     return res.statusCode(status).json(resObj);
// };

module.exports = {
  generateUserToken,
  getToken,
  generateAuthCode,
  getNowInString,
  translateError,
  // respond
};
