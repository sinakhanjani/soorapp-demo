// FK8 //

const router = require('express').Router();
const isAdmin = require('../../utils/authentication/isAdmin');
const { webAuth } = require('../../utils/authentication/authentication');
const productCategory = require('../../controllers/web/productCategory');
const fk8Upload = require('../../utils/multer/fk8Upload');

router.get('/new', webAuth, isAdmin, productCategory.getRegisterPage);

router.post('/:adminID/update', webAuth, fk8Upload.single('fileImage'), productCategory.postUpdate);

router.post('/:adminID/delete', webAuth, productCategory.postDelete);

router.get('/:adminID', webAuth, productCategory.getEditPage);

router.post('/', webAuth, fk8Upload.single('fileImage'), isAdmin, productCategory.postRegister);

router.get('/', webAuth, isAdmin, productCategory.getAdminPage);

module.exports = router;