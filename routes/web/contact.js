const router = require('express').Router();
const { getContactPage, postSms } = require('../../controllers/web/contact');
const { webAuth } = require('../../utils/authentication/authentication');

router.get('/sms', webAuth, getContactPage);

router.post('/sms', webAuth, postSms);

module.exports = router;
