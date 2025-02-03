const persianDate = require('persian-date');

module.exports = function (arg) {
  if (arg.steps) {
    // is called with an event
    arg.date = new persianDate(arg.date).format('L');
    for (let step of arg.steps) {
      step = stepDateConverter(step);
    }
  } else {
    // we called with a step
    arg = stepDateConverter(arg);
  }
  return arg;
};

function stepDateConverter(step) {
  step.startDate = new persianDate(step.startDate).format('L');
  step.endDate = new persianDate(step.endDate).format('L');
  return step;
}
