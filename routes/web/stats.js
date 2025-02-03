const router = require('express').Router();
const { webAuth } = require('../../utils/authentication/authentication');
const { getStats } = require('../../controllers/web/stats');

router.get('/', webAuth, getStats);

module.exports = router;
