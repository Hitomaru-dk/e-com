const productService = require('../services/productService');

const getProducts = (req, res) => {
  try {
    const products = productService.getAllProducts();
    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = (req, res) => {
  try {
    const product = productService.getProductById(req.params.id);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProductById };