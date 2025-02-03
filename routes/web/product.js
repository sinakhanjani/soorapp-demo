// FK8 //

const router = require('express').Router();
const isAdmin = require('../../utils/authentication/isAdmin');
const { webAuth } = require('../../utils/authentication/authentication');
const product = require('../../controllers/web/product');
const fk8Upload = require('../../utils/multer/fk8Upload');

router.get('/new', webAuth, isAdmin, product.getRegisterPage);

router.post('/:adminID/update', fk8Upload.any(), webAuth, product.postUpdate);

router.post('/:adminID/delete', webAuth, product.postDelete);

router.get('/:adminID', webAuth, product.getEditPage);

router.post('/', webAuth, fk8Upload.any(), isAdmin, product.postRegister);

router.get('/', webAuth, isAdmin, product.getAdminPage);

module.exports = router;
