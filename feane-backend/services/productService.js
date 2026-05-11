const productRepository = require('../repositories/productRepository');

const toDTO = (product) => ({
  id:          product.id,
  title:       product.name,
  price:       product.price,
  category:    product.category,
  image:       product.image,
  description: product.description
});

const getAllProducts = (category = null) => {
  const raw = category
    ? productRepository.findByCategory(category)
    : productRepository.findAll();
  return raw.map(toDTO);
};

const getProductById = (id) => {
  const product = productRepository.findById(id);
  if (!product) throw new Error(`Product with id ${id} not found`);
  return toDTO(product);
};

module.exports = { getAllProducts, getProductById };