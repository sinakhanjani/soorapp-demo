const router = require('express').Router();
const index = require('../../controllers/web/index');
const { webAuth } = require('../../utils/authentication/authentication');

// this route redirects to /web/admin/index below
router.get('/', webAuth, index.rootRedirect);

router.get('/index', webAuth, index.index);

module.exports = router;
