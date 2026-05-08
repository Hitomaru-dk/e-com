/**
 * services/orderService.js
 *
 * Service Layer — Business Logic ของ checkout และ orders
 * - Validation rules (cart, email, card)
 * - คำนวณ total
 * - สร้าง order object ก่อนส่งให้ repository บันทึก
 *
 * ก่อนหน้านี้ logic เหล่านี้อยู่กระจัดกระจายใน routes/checkout.js
 * ซึ่งทำให้ทดสอบแยกไม่ได้และ route ใหญ่เกินไป
 */

const orderRepository = require('../repositories/orderRepository');

// ─── Validation Rules ─────────────────────────────────────────────────────────

const validateCartItems = (items) => {
  if (!Array.isArray(items) || items.length === 0)
    return 'Cart is empty. Please add items before checking out.';
  for (const item of items) {
    if (!item.name || typeof item.price !== 'number' || item.price <= 0)
      return 'One or more cart items are invalid (missing name or price).';
  }
  return null;
};

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return 'Email is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    return 'Invalid email format. Please enter a valid email address.';
  return null;
};

const validateCardNumber = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string')
    return 'Credit card number is required.';
  const digits = cardNumber.replace(/[\s\-]/g, '');
  if (!/^\d{16}$/.test(digits))
    return 'Credit card number must be exactly 16 digits.';
  return null;
};

// ─── Business Logic ───────────────────────────────────────────────────────────

/**
 * คำนวณ total จาก cart items
 * @param {Array} items
 * @returns {number}
 */
const calculateTotal = (items) => {
  const total = items.reduce((sum, item) => {
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    return sum + item.price * qty;
  }, 0);
  return Math.round(total * 100) / 100;
};

/**
 * ประมวลผล checkout ทั้งกระบวนการ
 * 1. Validate inputs
 * 2. คำนวณ total
 * 3. บันทึกผ่าน repository
 *
 * @param {{ cartItems: Array, email: string, cardNumber: string }} payload
 * @returns {Promise<{ success: boolean, order?: Object, errors?: Object }>}
 */
const processCheckout = async (payload) => {
  const { cartItems, email, cardNumber } = payload;

  // ─── Validation ──────────────────────────────────────────────────────
  const errors = {};
  const cartErr = validateCartItems(cartItems);  if (cartErr) errors.cartItems  = cartErr;
  const emailErr = validateEmail(email);          if (emailErr) errors.email     = emailErr;
  const cardErr  = validateCardNumber(cardNumber); if (cardErr)  errors.cardNumber = cardErr;

  if (Object.keys(errors).length > 0)
    return { success: false, errors };

  // ─── Build + Save ─────────────────────────────────────────────────────
  const total    = calculateTotal(cartItems);
  const cardLast4 = cardNumber.replace(/[\s\-]/g, '').slice(-4);

  // Repository รับผิดชอบการบันทึกลง DB
  const { order_id } = await orderRepository.create({
    user_id:     1,           // TODO: ดึงจาก JWT session เมื่อ implement auth
    total_price: total,
    card_last4:  cardLast4,
    email:       email.trim(),
    items:       cartItems.map(item => ({
      product_id: item.id || 0,
      quantity:   item.quantity || 1,
      price:      item.price
    }))
  });

  return {
    success: true,
    order: {
      id:    order_id,
      email: email.trim(),
      total,
      items: cartItems,
      date:  new Date().toISOString()
    }
  };
};

/**
 * ดึง orders ของ user คนหนึ่ง
 * @param {number} user_id
 * @returns {Promise<Array>}
 */
const getOrdersByUser = (user_id) => orderRepository.findByUserId(user_id);

module.exports = { processCheckout, getOrdersByUser };