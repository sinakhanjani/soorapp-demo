const router = require('express').Router();
const isAdmin = require('../../utils/authentication/isAdmin');
const { webAuth } = require('../../utils/authentication/authentication');
const admin = require('../../controllers/web/admin');

router.get('/new', webAuth, isAdmin, admin.getRegisterPage);

router.post('/:adminID/update', webAuth, admin.postUpdate);

router.post('/:adminID/delete', webAuth, admin.postDelete);

router.get('/changepassword', webAuth, admin.getChangePassword);

router.post('/changepassword', webAuth, admin.postChangePassword);

router.get('/:adminID', webAuth, admin.getEditPage);

router.post('/', webAuth, isAdmin, admin.postRegister);

router.get('/', webAuth, isAdmin, admin.getAdminPage);


module.exports = router;
