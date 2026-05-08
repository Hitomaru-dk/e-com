/**
 * repositories/orderRepository.js
 *
 * Repository Pattern — รับผิดชอบ SQL queries สำหรับ orders และ order_items เท่านั้น
 * ไม่มี validation, ไม่มี business rules — แค่ CRUD กับ store.db
 *
 * OrderService จะเป็นคนเรียก repository นี้
 * ถ้าเปลี่ยน DB จาก SQLite เป็น MySQL/PostgreSQL แก้แค่ไฟล์นี้
 */

const db = require('../database');

/**
 * INSERT order header + order_items ลง store.db
 * ใช้ db.serialize() เพื่อให้ทั้งสอง INSERT ทำงานตามลำดับ (sequential)
 *
 * @param {Object} orderData
 * @param {number} orderData.user_id
 * @param {number} orderData.total_price
 * @param {string} orderData.card_last4
 * @param {string} orderData.email
 * @param {Array}  orderData.items  - [{ product_id, quantity, price }]
 * @returns {Promise<{ order_id: number }>}
 */
const create = (orderData) => {
  return new Promise((resolve, reject) => {
    const { user_id, total_price, card_last4, email, items } = orderData;

    db.serialize(() => {
      const insertOrderSQL = `
        INSERT INTO orders (user_id, total_price, card_last4, email, order_date)
        VALUES (?, ?, ?, ?, DATE('now'))
      `;

      db.run(insertOrderSQL, [user_id, total_price, card_last4, email], function (err) {
        if (err) return reject(new Error('DB error (orders): ' + err.message));

        const newOrderId = this.lastID;

        const insertItemSQL = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `;
        const stmt = db.prepare(insertItemSQL);

        for (const item of items) {
          stmt.run([newOrderId, item.product_id, item.quantity, item.price]);
        }

        stmt.finalize((finalErr) => {
          if (finalErr) return reject(new Error('DB error (order_items): ' + finalErr.message));
          resolve({ order_id: newOrderId });
        });
      });
    });
  });
};

/**
 * SELECT orders + order_items ของ user คนหนึ่ง
 * @param {number} user_id
 * @returns {Promise<Array>}
 */
const findByUserId = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        o.id          AS order_id,
        o.user_id,
        o.total_price,
        o.order_date,
        oi.product_id,
        oi.quantity,
        oi.price      AS item_price
      FROM   orders o
      JOIN   order_items oi ON oi.order_id = o.id
      WHERE  o.user_id = ?
      ORDER  BY o.order_date DESC
    `;
    db.all(sql, [user_id], (err, rows) => {
      if (err) return reject(new Error('DB error (findByUserId): ' + err.message));
      resolve(rows);
    });
  });
};

module.exports = { create, findByUserId };