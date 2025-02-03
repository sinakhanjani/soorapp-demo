const smsPanel = require('../../utils/helpers/SMSHelper');
const Verify = require('../../models/Verify');
const User = require('../../models/User');
const Event = require('../../models/Event');
const stepsDB = require('../../utils/staticData/steps');
const { generateAuthCode, generateUserToken } = require('../../utils/utils');
const dateConverter = require('../../utils/dateConverter');

const { sendNotificationWithUserId } = require('../../utils/helpers/NotificationHelper');
const messages = require('../../utils/staticData/notifications');

const sendCode = async (req, res, next) => {
  let authCode;
  const { mobile } = req.body;

  if (!mobile || mobile.length !== 11) return next('شماره موبایل به درستی ارسال نشده است');

  try {
    authCode = generateAuthCode();

    await removeCode(mobile);
    await Verify.create({ mobile, authCode });
    await smsPanel.sendRegCode(mobile, authCode);

    return res.json({ status: true });
  } catch (err) {
    await removeCode(mobile);
    return next(err);
  }
};

const verify = async (req, res, next) => {
  let foundVerify; let foundUser; let token; let
    isNew;
  const { mobile } = req.body;
  const { code } = req.body;
  const { fcmToken } = req.body;

  try {
    if (!mobile || !code) return next('درخواست به درستی ارسال نشده است');

    foundVerify = await Verify.findOne({ mobile });

    if (!foundVerify) { return next('درخواست ارسال پیامک برای این شماره ثبت نشده است.'); }
    if (code !== foundVerify.authCode) return next('کد وارد شده معتبر نمی باشد');

    foundUser = await User.findOne({ mobile });
    if (!foundUser) {
      isNew = true;
      const createdUser = await User.create({ mobile, fcmToken });
      token = generateUserToken(createdUser._id);
    } else {
      // user exists, so we just login
      isNew = false;
      token = generateUserToken(foundUser._id);
      if (fcmToken && foundUser.fcmToken !== fcmToken) {
        foundUser.fcmToken = fcmToken;
        await foundUser.save();
      }
    }
    // remove the code
    await removeCode(mobile);

    return res.json({ status: true, token, isNew });
  } catch (err) { return next(err); }
};

const updateProfile = async (req, res, next) => {
  let user; let
    updObj;
  try {
    updObj = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      birthDate: req.body.birthDate,
      province: req.body.province,
      city: req.body.city,
      gender: req.body.gender,
      fcmToken: req.body.fcmToken,
    };

    if (req.file) {
      updObj.photo = `${req.file.destination.slice(7)}${req.file.filename}`;
    }

    await User.findByIdAndUpdate(req.userID, updObj, { omitUndefined: true, new: true });

    user = await User.findById(req.userID)
      .populate('event')
      .populate('city')
      .populate('province')
      .lean();

    if (user.event) {
      user.event = dateConverter(user.event);
    }

    return res.json({ status: true, user });
  } catch (err) { return next(err); }
};

const getme = async (req, res, next) => {
  let foundUser;
  try {
    foundUser = await User.findById(req.userID)
      .populate('event')
      .populate('city')
      .populate('province')
      .lean();

    if (!foundUser) return next('کاربری با این ای دی وجود ندارد');
    if (foundUser.event) {
      foundUser.event = dateConverter(foundUser.event);
    }

    return res.json({ status: true, user: foundUser });
  } catch (err) { return next(err); }
};

const sendnotif = async (req, res, next) => {
  try {
    const { option } = req.query;

    const event = await Event.findById(req.eventID);
    if (!event) return next('ابتدا مراسم خود را ثبت نمایید');

    await sendNotificationWithUserId(
      event.steps[option].title,
      messages.start(req.user.firstName, stepsDB[option].title, stepsDB[option].duration),
      req.userID,
    );

    return res.json({ status: true });
  } catch (err) {
    return next(err);
  }
};

const removeCode = async (mobileNumber) => {
  await Verify.deleteMany({ mobile: mobileNumber }, (err) => {
    if (err) console.log(err);
  });
};

module.exports = {
  verify,
  sendCode,
  updateProfile,
  getme,
  sendnotif,
};
