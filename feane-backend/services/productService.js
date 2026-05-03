const products = require('../data/products.json');

// Service layer: Handles business logic for product data retrieval
// This layer abstracts data access and applies business rules

/**
 * Retrieves all products or filters by category if specified
 * @param {string} category - Optional category to filter products
 * @returns {Array} Array of product objects
 */
const getAllProducts = (category = null) => {
  let filteredProducts = products;

  // Apply category filter if provided
  if (category) {
    filteredProducts = products.filter(product => product.category.toLowerCase() === category.toLowerCase());
  }

  // Map data to match frontend expectations (name -> title)
  return filteredProducts.map(product => ({
    id: product.id,
    title: product.name, // Rename 'name' to 'title' for frontend compatibility
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description
  }));
};

/**
 * Retrieves a single product by ID
 * @param {number} id - Product ID
 * @returns {Object} Product object
 * @throws {Error} If product not found
 */
const getProductById = (id) => {
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) throw new Error(`Product with id ${id} not found`);

  // Return mapped product data
  return {
    id: product.id,
    title: product.name,
    price: product.price,
    category: product.category,
    image: product.image,
    description: product.description
  };
};

module.exports = { getAllProducts, getProductById };