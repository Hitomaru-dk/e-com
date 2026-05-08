/**
 * routes/products.js — เชื่อม URL กับ controller เท่านั้น
 */
const express           = require('express');
const router            = express.Router();
const productController = require('../controllers/productController');

router.get('/',    productController.getProducts);
router.get('/:id', productController.getProductById);

module.exports = router;