// FK8 //

const router = require('express').Router();
const isAdmin = require('../../utils/authentication/isAdmin');
const { webAuth } = require('../../utils/authentication/authentication');
const article = require('../../controllers/web/article');

// router.get('/new', webAuth, isAdmin, admin.getRegisterPage);

router.post('/:adminID/update', webAuth, article.postUpdate);

// router.post('/:adminID/delete', webAuth, admin.postDelete);

// router.get('/changepassword', webAuth, admin.getChangePassword);

// router.post('/changepassword', webAuth, admin.postChangePassword);

router.get('/:adminID', webAuth, article.getEditPage);

// router.post('/', webAuth, isAdmin, admin.postRegister);

router.get('/', webAuth, isAdmin, article.getAdminPage);


module.exports = router;
