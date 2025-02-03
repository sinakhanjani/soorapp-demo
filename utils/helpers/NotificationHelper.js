const axios = require('axios');
const User = require('../../models/User');
const { notifConfig } = require('../../config/config');

const sendNotificationWithToken = async (title, message, token) => {
  try {
    const response = await axios.post(notifConfig.url, {
      to: token,
      content_available: true,
      priority: 'high',
      notification: {
        body: message,
        title,
      },
      data: { articleId: '1' },
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: notifConfig.key,
      },
    });

    // I do not know what the response structure is
    // I have to test and then code this part
    // if notif send has failed, call the function again, resend
    console.log(response.data);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const sendNotificationWithUserId = async (title, message, userID) => {
  try {
    const user = await User.findById(userID);
    await sendNotificationWithToken(title, message, user.fcmToken);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  sendNotificationWithToken,
  sendNotificationWithUserId,
};
