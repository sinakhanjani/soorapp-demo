const User = require('../../models/User');
const Event = require('../../models/Event');
const SMSHelper = require('../../utils/helpers/SMSHelper');

const index = (req, res) => {
  Promise.all([
    User.estimatedDocumentCount().exec(),
    Event.estimatedDocumentCount().exec(),
    SMSHelper.getCredit().catch((err) => err.message),
  ]).then((data) => {
    const statsDeconstruct = {
      usersCount: data[0],
      eventsCount: data[1],
      remainingCredit: data[2],
    };

    return res.render('./index', { stats: statsDeconstruct });
  }).catch(() => res.render('./index', { stats: { usersCount: '-', eventsCount: '-', remainingCredit: '-' } }));
};

const rootRedirect = (req, res) => {
  res.redirect('/index');
};

module.exports = {
  rootRedirect,
  index,
};
