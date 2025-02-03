module.exports = function (step) {
  const TWO_DAYS_IN_MILLISECONDS = 1.728e+8;
  const now = new Date();

  if (step.startDate - now > 0) {
    // not started
    step.state = 0;
  } else {
    // passed start date
    if ((step.endDate - now > 0)) {
      // end date not passed yet
      step.state = 1;
    } else if ((step.endDate - now < 0) && (now - step.endDate < TWO_DAYS_IN_MILLISECONDS)) {
      // less than two days passed from end date
      step.state = 2;
    } else {
      // more than 2 days passed from end date
      step.state = 3;
    }
  }
  return step;
};
