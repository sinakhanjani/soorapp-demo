const router = require('express').Router();
const { getDateTime } = require('../../controllers/api/datetime');

router.get('/', getDateTime);

module.exports = router;
