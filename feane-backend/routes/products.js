// Routes layer: Defines API endpoints and maps them to controller functions
// This layer handles URL routing and HTTP method delegation

const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products - Retrieve all products or filter by category (?category=food)
router.get('/', productController.getProducts);

// GET /api/products/:id - Retrieve a single product by ID
router.get('/:id', productController.getProductById);

module.exports = router;