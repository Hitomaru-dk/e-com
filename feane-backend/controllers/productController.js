const productService = require('../services/productService');

// Controller layer: Handles HTTP requests and responses
// Acts as an intermediary between routes and services

/**
 * Handles GET /api/products
 * Retrieves products, optionally filtered by category query parameter
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProducts = (req, res) => {
  try {
    // Extract category from query parameters (e.g., ?category=burger)
    const { category } = req.query;

    // Call service layer to get products (filtered if category provided)
    const products = productService.getAllProducts(category);

    // Return successful response with product data
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    // Handle any errors from service layer
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Handles GET /api/products/:id
 * Retrieves a single product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getProductById = (req, res) => {
  try {
    // Extract product ID from route parameters
    const product = productService.getProductById(req.params.id);

    // Return successful response with product data
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    // Handle not found or other errors
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { getProducts, getProductById };