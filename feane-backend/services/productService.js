const products = require('../data/products.json');

const getAllProducts = () => products;
const getProductById = (id) => {
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) throw new Error(`Product with id ${id} not found`);
  return product;
};

module.exports = { getAllProducts, getProductById };