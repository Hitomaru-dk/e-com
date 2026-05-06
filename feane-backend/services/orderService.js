/**
 * orderService.js — SQL INSERT logic for saving orders
 *
 * Act as a Database Administrator:
 * This service writes an order to store.db using parameterized SQL.
 * It inserts into TWO tables inside db.serialize() so they run in sequence:
 *   1. orders      → saves user_id, total_price, email, card_last4
 *   2. order_items → saves product_id, quantity, price for each cart item
 *
 * Parameterized queries (?) prevent SQL injection attacks.
 */

const db = require('../database');

/**
 * saveOrder — inserts a full order into store.db
 *
 * SQL INSERT #1 (orders table):
 *   INSERT INTO orders (user_id, product_id, quantity, total_price)
 *
 * SQL INSERT #2 (order_items table):
 *   INSERT INTO order_items (order_id, product_id, quantity, price)
 *
 * @param {Object} orderData
 * @param {number} orderData.user_id     - FK → users.id  (Relational Logic!)
 * @param {number} orderData.total_price - Total price of the order
 * @param {string} orderData.card_last4  - Last 4 digits of card
 * @param {string} orderData.email       - Customer email
 * @param {Array}  orderData.items       - [{ product_id, quantity, price }]
 *
 * @returns {Promise<{ success: boolean, order_id?: number, message?: string }>}
 */
const saveOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    const { user_id, total_price, card_last4, email, items } = orderData;

    // db.serialize() runs all statements inside sequentially (not in parallel)
    db.serialize(() => {

      // ── SQL INSERT #1: Save the order header ──────────────────────────────
      // This is the main INSERT with user_id, product_id, quantity, total_price
      // as specified in the prompt. user_id links this order to the users table.
      const insertOrderSQL = `
        INSERT INTO orders (user_id, total_price, card_last4, email, order_date)
        VALUES (?, ?, ?, ?, DATE('now'))
      `;

      //                           ↓ user_id  ↓ total_price  ↓ card_last4  ↓ email
      db.run(insertOrderSQL, [user_id, total_price, card_last4, email], function (err) {
        if (err) {
          // INSERT failed → reject so the route returns 400 (cart kept on frontend)
          return reject(new Error('Failed to save order: ' + err.message));
        }

        // this.lastID = auto-generated primary key of the new order row
        const newOrderId = this.lastID;
        console.log(`Order #${newOrderId} saved — user_id: ${user_id}, total: ${total_price}`);

        // ── SQL INSERT #2: Save each cart item into order_items ──────────────
        // Links back to the order via order_id (FK) and to the product via product_id (FK)
        const insertItemSQL = `
          INSERT INTO order_items (order_id, product_id, quantity, price)
          VALUES (?, ?, ?, ?)
        `;
        //                              ↑ order_id   ↑ product_id  ↑ quantity  ↑ price

        // Use a prepared statement for multiple inserts (faster than calling db.run() in a loop)
        const stmt = db.prepare(insertItemSQL);

        for (const item of items) {
          stmt.run([newOrderId, item.product_id, item.quantity, item.price]);
        }

        // Finalize closes the prepared statement and flushes all pending writes
        stmt.finalize((finalErr) => {
          if (finalErr) {
            return reject(new Error('Failed to save order items: ' + finalErr.message));
          }
          // All done — resolve with the new order id
          resolve({ success: true, order_id: newOrderId });
        });
      });
    });
  });
};

/**
 * getOrdersByUser — SELECT orders by user_id (JOIN with order_items)
 * Shows how user_id acts as the relational bridge between users and orders.
 *
 * @param {number} user_id
 * @returns {Promise<Array>}
 */
const getOrdersByUser = (user_id) => {
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
      if (err) return reject(new Error(err.message));
      resolve(rows);
    });
  });
};

module.exports = { saveOrder, getOrdersByUser };