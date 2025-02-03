const router = require('express').Router();
const { getLoginPage, postLogin, getLogOut } = require('../../controllers/web/login');

router.get('/login', getLoginPage);

router.post('/login', postLogin);

router.get('/logout', getLogOut);

module.exports = router;
