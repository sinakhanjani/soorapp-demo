const router = require('express').Router();
const {
  createEvent, getEvent, stepDone, stepUndone, filterSteps, getStep,
} = require('../../controllers/api/event');
const { tokenAuth } = require('../../utils/authentication/authentication');

router.get('/', tokenAuth, getEvent);

router.post('/', tokenAuth, createEvent);

router.post('/steps/done', tokenAuth, stepDone);

router.post('/steps/undone', tokenAuth, stepUndone);

router.get('/steps', tokenAuth, getStep);

router.post('/steps/filter', tokenAuth, filterSteps);

module.exports = router;
