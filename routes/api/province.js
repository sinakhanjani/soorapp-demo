const router = require('express').Router();
const { tokenAuth } = require('../../utils/authentication/authentication');
const { getProvinces } = require('../../controllers/api/province');

router.get('/', tokenAuth, getProvinces);

module.exports = router;
