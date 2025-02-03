const Moment = require('moment');
const Event = require('../../models/Event');
const stepsDB = require('../../utils/staticData/steps');
const { sendNotificationWithToken } = require('../helpers/NotificationHelper');
const notifMessages = require('../staticData/notifications');
const { logger, errorLogger } = require('../helpers/Logger');

function startNotifs(job, done) {
  // console.log(job.attrs.data.providerID);
  const nowMoment = new Moment().startOf('day').toDate();
  const ninetyDays = nowMoment.clone().add(91, 'days').toDate();
  const now = new Date();

  Event.aggregate([
    {
      $match: { date: { $gte: now, $lte: ninetyDays } },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: '$steps',
    },
    {
      $match: { 'steps.startDate': now, 'steps.state': { $ne: 4 } },
    },
  ])
    .exec(async (err, events) => {
      logger.info('start notif sent for these');
      logger.info(JSON.stringify(events, undefined, 2));

      if (err) return done(err);
      if (events.length === 0) return done();

      for (let i = 0; i < events.length; i++) {
        let user;
        try {
          const step = events[i].steps;
          user = events[i].user[0];
          await sendNotificationWithToken(
            step.title,
            notifMessages.start(user.firstName, step.title, stepsDB[step.article].duration),
            user.fcmToken,
          );
          logger.info(notifMessages.start(user.firstName, step.title, stepsDB[step.article].duration));
        } catch (error) {
          errorLogger(`start notification error for the user ${user}${error}`);
        }
      }

      done();
    });
}

async function runStartNotifs(agenda) {
  const sendNotifis = agenda.create('start_notifications', {});
  sendNotifis.repeatEvery('30 10 * * *', { timezone: 'Asia/Tehran', skipImmediate: true });
  sendNotifis.unique({ name: 'start_notifications' }, {});

  await sendNotifis.save();
}

module.exports = {
  startNotifs,
  runStartNotifs,
};
