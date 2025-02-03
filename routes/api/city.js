const router = require('express').Router();
const { tokenAuth } = require('../../utils/authentication/authentication');
const { getCities } = require('../../controllers/api/city');

router.get('/', tokenAuth, getCities);

module.exports = router;
