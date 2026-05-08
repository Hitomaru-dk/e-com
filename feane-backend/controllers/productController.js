/**
 * controllers/productController.js
 *
 * Controller — HTTP layer สำหรับ products
 * ไม่รู้จักว่าข้อมูลมาจาก JSON หรือ DB — นั่นเป็นเรื่องของ service + repository
 */

const productService = require('../services/productService');

/**
 * GET /api/products
 * GET /api/products?category=burger
 */
const getProducts = (req, res) => {
  try {
    const { category } = req.query;
    const products = productService.getAllProducts(category);
    return res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/products/:id
 */
const getProductById = (req, res) => {
  try {
    const product = productService.getProductById(req.params.id);
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById };