const User = require('../../models/User');
const SMSHelper = require('../../utils/helpers/SMSHelper');

const getContactPage = (req, res) => {
  res.render('./contact/index');
};

const postSms = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ status: false });

    const users = await User.find().select('mobile').lean();

    const mobileNumbers = users.map((user) => user.mobile);

    await SMSHelper.send(message, mobileNumbers);

    return res.json({ status: true });
  } catch (error) {
    return res.status(500).json({ status: false, error: error.message });
  }
};

module.exports = {
  getContactPage,
  postSms,
};
