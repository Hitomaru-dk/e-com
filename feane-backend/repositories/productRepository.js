/**
 * repositories/productRepository.js
 *
 * Repository Pattern — รับผิดชอบการอ่านข้อมูล product จาก data source เท่านั้น
 * ปัจจุบัน source คือ products.json
 * อนาคต: เปลี่ยนเป็น db.query() ได้เลยโดยไม่กระทบ ProductService
 */

const products = require('../data/products.json');

/**
 * ดึง product ทั้งหมด (raw data ไม่มีการแปลงค่า)
 * @returns {Array<Object>}
 */
const findAll = () => products;

/**
 * ค้นหา product จาก id
 * @param {number|string} id
 * @returns {Object|null}
 */
const findById = (id) => {
  return products.find(p => p.id === parseInt(id)) || null;
};

/**
 * ค้นหา products จาก category (case-insensitive)
 * @param {string} category
 * @returns {Array<Object>}
 */
const findByCategory = (category) => {
  return products.filter(
    p => p.category.toLowerCase() === category.toLowerCase()
  );
};

module.exports = { findAll, findById, findByCategory };