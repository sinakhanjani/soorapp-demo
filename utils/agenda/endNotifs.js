const Moment = require('moment');
const Event = require('../../models/Event');
const { sendNotificationWithToken } = require('../helpers/NotificationHelper');
const notifMessages = require('../staticData/notifications');
const { logger, errorLogger } = require('../helpers/Logger');

function endNotifs(job, done) {
  logger.info('run end notifs job');

  const nowMoment = new Moment().startOf('day');
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
      $match: { 'steps.endDate': nowMoment.toDate(), 'steps.state': { $ne: 4 } },
    },
  ])
    .exec(async (err, events) => {
      logger.info('steps that end today');
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
            notifMessages.end(user.firstName, step.title),
            user.fcmToken,
          );
          logger.info(notifMessages.end(user.firstName, step.title));
        } catch (error) {
          errorLogger(`late notification error for the user ${user}${error}`);
        }
      }
      done();
    });
}

async function runEndNotifs(agenda) {
  const endNotifis = agenda.create('end_notifications', {});
  endNotifis.repeatEvery('0 11 * * *', { timezone: 'Asia/Tehran', skipImmediate: true });
  endNotifis.unique({ name: 'end_notifications' }, {});

  await endNotifis.save();
}

module.exports = {
  endNotifs,
  runEndNotifs,
};
