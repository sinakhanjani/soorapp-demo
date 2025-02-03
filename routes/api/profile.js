const router = require('express').Router();
const { tokenAuth } = require('../../utils/authentication/authentication');
const {
  sendCode, verify, updateProfile, getme, sendnotif,
} = require('../../controllers/api/profile');
const profilePicUpload = require('../../utils/multer/profilePicUpload');

router.post('/sendCode', sendCode);

router.post('/verify', verify);

router.post('/update', tokenAuth, profilePicUpload.single('photo'), updateProfile);

router.get('/getme', tokenAuth, getme);

router.get('/sendnotif', tokenAuth, sendnotif);

module.exports = router;
