/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Moment = require('moment');
const stepsDB = require('../utils/staticData/steps');
const articlesDB = require('../utils/staticData/articles');
const stepDateConfigurator = require('../utils/stepDateConfigurator');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'عروسی',
  },
  date: {
    type: Date,
    required: true,
  },
  steps: [
    {
      title: {
        type: String,
      },
      description: {
        type: String,
        default: '',
      },
      startDate: Date,
      endDate: Date,
      state: Number,
      isDone: Boolean,
      article: {
        type: Number,
        ref: 'Article',
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
}, { timestamps: true });

// 0 - not started yet,
// 1 - started and not ended yet
// 2 - less than 2 days passed from end time,
// 3 - more than 2 days passed from end time,
// 4 - done

eventSchema.pre('save', function updateState(next) {
  const PROCESS_DURATION = 90;

  if (this.isNew) {
    const eventDate = new Moment(this.date);
    for (let i = 0; i < stepsDB.length; i++) {
      const eveDateClone1 = eventDate.clone();
      const eveDateClone2 = eventDate.clone();
      let step = {
        title: stepsDB[i].name,
        description: articlesDB[i].description,
        startDate: eveDateClone1.subtract(PROCESS_DURATION - stepsDB[i].start, 'days').toDate(),
        endDate: eveDateClone2.subtract(PROCESS_DURATION - stepsDB[i].end, 'days').toDate(),
        isDone: false,
        article: articlesDB[i]._id,
      };

      step = stepDateConfigurator(step);

      this.steps.push(step);
    }
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
