const router = require('express').Router();
const {
  getUsersPage, postUserTable, getAllUsersCSV,
} = require('../../controllers/web/user');
const { webAuth } = require('../../utils/authentication/authentication');

router.get('/', webAuth, getUsersPage);

router.post('/table', webAuth, postUserTable);

router.get('/csv/allUsers', webAuth, getAllUsersCSV);

// router.get('/csv/:userId', webAuth, getUserCSV);

module.exports = router;
