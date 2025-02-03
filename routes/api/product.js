const router = require('express').Router();
const { tokenAuth } = require('../../utils/authentication/authentication');
const { getProductCategorys, getProducts } = require('../../controllers/api/product');

router.get('/productcategory', getProductCategorys);
router.get('/', getProducts);

module.exports = router;
