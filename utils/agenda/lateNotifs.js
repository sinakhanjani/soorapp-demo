const Moment = require('moment');
const Event = require('../../models/Event');
const { sendNotificationWithToken } = require('../helpers/NotificationHelper');
const notifMessages = require('../staticData/notifications');
const { logger, errorLogger } = require('../helpers/Logger');

function lateNotifs(job, done) {
  const nowMoment = new Moment().startOf('day');
  const threeDaysAgo = nowMoment.clone().subtract(3, 'days').toDate();
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
      $match: { 'steps.endDate': threeDaysAgo, 'steps.state': { $ne: 4 } },
    },
  ])
    .exec(async (err, events) => {
      logger.info('events that 3 days has passed from end date');
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
            notifMessages.late(user.firstName, step.title),
            user.fcmToken,
          );
          logger.info(notifMessages.late(user.firstName, step.title));
        } catch (error) {
          errorLogger('late notification error');
          errorLogger(`${user}${error}`);
        }
      }
      done();
    });
}

async function runLateNotifs(agenda) {
  const lateNotifis = agenda.create('late_notifications', {});
  lateNotifis.repeatEvery('30 11 * * *', { timezone: 'Asia/Tehran', skipImmediate: true });
  lateNotifis.unique({ name: 'late_notifications' }, {});

  await lateNotifis.save();
}


module.exports = {
  lateNotifs,
  runLateNotifs,
};
