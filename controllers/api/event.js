/* eslint-disable no-underscore-dangle */
const PersianDate = require('persian-date');
const Event = require('../../models/Event');
const User = require('../../models/User');
const dateConverter = require('../../utils/dateConverter');
const stepDateConfigurator = require('../../utils/stepDateConfigurator');

const getEvent = async (req, res, next) => {
  try {
    let foundEvent = await Event.findById(req.eventID).lean();
    if (!foundEvent) return next('مراسمی برای شما ثیت نشده است');
    foundEvent = dateConverter(foundEvent);

    return res.json({ status: true, event: foundEvent });
  } catch (err) {
    return next(err);
  }
};

const getStep = async (req, res, next) => {
  try {
    const event = await Event.findById(req.eventID).populate('steps.article');
    if (!event) return next('مراسمی برای شما ثیت نشده است');

    let step = event.steps.id(req.query.stepID);
    if (!step) return next('ای دی اقدام به درستی ارسال نشده است');

    step = dateConverter(step.toObject());

    return res.json({ status: true, step });
  } catch (err) {
    return next(err);
  }
};

const createEvent = async (req, res, next) => {
  try {
    // find the old event (if exists) and remove before creating the new one
    const user = await User.findById(req.userID);
    if (user.event) {
      const oldEvent = await Event.findById(user.event);
      if (oldEvent) await oldEvent.remove();
    }

    const date = new PersianDate([req.body.year, req.body.month, req.body.day]).toDate();
    const event = {
      user: req.userID,
      title: req.body.title || 'عروسی',
      date,
    };
    let newEvent = await Event.create(event);
    user.event = newEvent._id;

    newEvent = dateConverter(newEvent.toObject());

    await user.save();

    return res.json({ status: true, event: newEvent });
  } catch (err) {
    return next(err);
  }
};

const stepDone = async (req, res, next) => {
  const { steps } = req.body;
  if (!Array.isArray(steps)) return next('آرایه ای دی های مراحل به درستی ارسال نشده است');

  try {
    let event = await Event.findById(req.eventID);
    if (!event) return next('مراسمی برای شما ثیت نشده است');

    const notFoundSteps = [];
    for (const _id of steps) {
      const step = event.steps.id(_id);
      if (step) {
        step.isDone = true;
        step.state = 4;
      } else {
        notFoundSteps.push(_id);
      }
    }
    await event.save();
    event = dateConverter(event.toObject());
    return res.json({ status: true, event, notFoundSteps });
  } catch (err) {
    return next(err);
  }
};

const stepUndone = async (req, res, next) => {
  const { steps } = req.body;
  if (!Array.isArray(steps)) return next('آرایه ای دی های مراحل به درستی ارسال نشده است');

  try {
    let event = await Event.findById(req.eventID);
    if (!event) return next('مراسمی برای شما ثبت نشده است');

    const notFoundSteps = [];
    for (const _id of steps) {
      let step = event.steps.id(_id);
      if (step) {
        step.isDone = false;
        step = stepDateConfigurator(step);
      } else {
        notFoundSteps.push(_id);
      }
    }
    await event.save();
    event = dateConverter(event.toObject());

    return res.json({ status: true, event, notFoundSteps });
  } catch (err) {
    return next(err);
  }
};

const filterSteps = async (req, res, next) => {
  let event;
  let from; let
    to;

  const { week } = req.body;
  const { month } = req.body;
  const { year } = req.body;

  /*
    year 1398
    month 5
    week 2
    */

  if (!year) return next('ارسال مقدار برای سال الزامی است');
  if (week < 1 || week > 5) return next('مقدار هفته را اصلاح فرمایید');

  // we have the year
  const date = new PersianDate([year, month]);

  try {
    if (!week && !month) {
      // only the year was sent
      from = date.startOf('year').toDate();
      to = date.endOf('year').toDate();
    } else if (month && !week) {
      // the year and the month were sent
      from = date.startOf('month').toDate();
      to = date.endOf('month').toDate();
    } else {
      // year, month, week were all passes
      let begin = 0; const
        end = (week * 7) - 1;
      if (week > 1) {
        begin = ((week - 1) * 7) - 1;
      }

      from = date.clone().add('days', begin).toDate();
      to = date.clone().add('days', end).toDate();

      if (to > date.endOf('month').toDate()) {
        to = date.endOf('month').toDate();
      }
    }
    // if(date.startOf('week') < date.startOf('month')) {
    //     from = date.startOf('month').toDate();
    // } else {
    //     from = date.startOf('week').toDate();
    // }
    //
    // if(date.endOf('week') > date.endOf('month')) {
    //     to = date.endOf('month').toDate();
    // } else {
    //     to = date.endOf('week').toDate();
    // }


    event = await Event.aggregate([
      {
        $match: { _id: req.eventID },
      },
      {
        $project: {
          title: 1,
          date: 1,
          steps: {
            $filter: {
              input: '$steps',
              as: 'step',
              cond: {
                $and: [
                  { $gte: ['$$step.endDate', from] },
                  { $lte: ['$$step.endDate', to] },
                ],
              },
            },
          },
        },
      },
    ]);

    if (event.length === 0) return next('مراسمی برای شما ثبت نشده است');

    event = dateConverter(event[0]);

    return res.json({ status: true, event });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getEvent,
  createEvent,
  stepDone,
  stepUndone,
  getStep,
  filterSteps,
};
