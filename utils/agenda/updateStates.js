/* eslint-disable no-continue */
const Moment = require('moment');
const Event = require('../../models/Event');
const { logger, errorLogger } = require('../helpers/Logger');

async function updateStates(job, done) {
  // 0 - not started yet,
  // 1 - started and not ended yet
  // 2 - less than 2 days passed from end time,
  // 3 - more than 2 days passed from end time,
  // 4 - done

  const nowMoment = new Moment();
  const now = new Date();
  const nowMinusTwoDays = nowMoment.clone().subtract(2, 'days').toDate();
  const ninetyDays = nowMoment.clone().add(91, 'days').toDate();

  try {
    const events = await Event.find({ date: { $gte: now, $lte: ninetyDays } });
    for (let i = 0; i < events.length; i++) {
      let isUpdated = false;
      for (let j = 0; j < events[i].steps.length; j++) {
        const step = events[i].steps[j];
        // passed start date
        if (step.startDate > now) continue;
        // step.startDate < now &&
        if (step.endDate > now && step.state !== 1) {
          // steps that must changed to 1
          // not passed end date
          step.state = 1;
          isUpdated = true;
        } else if (step.endDate > nowMinusTwoDays && step.state !== 2) {
          // steps that must changed to 2
          // less than 2 days passed from end time
          step.state = 2;
          isUpdated = true;
        } else if (step.endDate < nowMinusTwoDays && step.state !== 3) {
          // steps that must changed to 3
          // more than 2 days passed from end time
          step.state = 3;
          isUpdated = true;
        }
      }
      if (isUpdated) {
        logger.info('updated an event');
        logger.info(events[i]);
        try {
          await events[i].save();
        } catch (err) {
          errorLogger(err);
        }
      }
    }
  } catch (err) {
    errorLogger(err);
  }

  done();
}

async function runUpdateStates(agenda) {
  try {
    const updateStateJob = agenda.create('update_states', {});
    updateStateJob.repeatEvery('1 0 * * *', { timezone: 'Asia/Tehran' });
    updateStateJob.unique({ name: 'updateStates' }, {});

    await updateStateJob.save();
  } catch (err) {
    errorLogger(err);
  }
}

module.exports = {
  updateStates,
  runUpdateStates,
};
