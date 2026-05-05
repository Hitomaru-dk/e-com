/**
 * checkout.js — Express POST route for /api/checkout
 *
 * GenAI Prompt used:
 * "Write an Express POST route for /api/checkout. The logic should check:
 *  1. the incoming cart items. 2. An email using regex. 3. A 16-digit credit
 *  card number. 4. Then, it should calculate the total. Crucially, include a
 *  try...catch block so that if the 'Save Order' step fails, it sends a 400
 *  status with a specific error message for each failed field, and does NOT
 *  clear the user's cart on the frontend."
 *
 * Contract:
 *  Request  POST /api/checkout
 *  Body     { cartItems: [...], email: string, cardNumber: string }
 *  Success  201 { success: true, order: { id, email, total, items, date } }
 *  Failure  400 { success: false, errors: { field: message } }
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to orders storage file
const ORDERS_PATH = path.join(__dirname, '../data/orders.json');

// ─────────────────────────────────────────────
// Validation helpers
// ─────────────────────────────────────────────

/**
 * Check 1 — Cart items must be a non-empty array
 * and every item must have a name and a positive price.
 *
 * @param {Array} items - Cart items from the request body
 * @returns {string|null} error message or null if valid
 */
const validateCartItems = (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    return 'Cart is empty. Please add items before checking out.';
  }
  for (const item of items) {
    if (!item.name || typeof item.price !== 'number' || item.price <= 0) {
      return 'One or more cart items are invalid (missing name or price).';
    }
  }
  return null; // null = valid
};

/**
 * Check 2 — Email must match standard email regex pattern.
 * Regex: local-part @ domain . tld (all non-whitespace segments)
 *
 * @param {string} email - Email string from the request body
 * @returns {string|null} error message or null if valid
 */
const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return 'Email is required.';
  }
  // Standard email regex: checks xxx@xxx.xxx format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return 'Invalid email format. Please enter a valid email address.';
  }
  return null;
};

/**
 * Check 3 — Credit card must be exactly 16 digits (numbers only).
 * Strips spaces/dashes before checking so "1234 5678 9012 3456" is accepted.
 *
 * @param {string} cardNumber - Card number string from the request body
 * @returns {string|null} error message or null if valid
 */
const validateCardNumber = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') {
    return 'Credit card number is required.';
  }
  // Remove spaces and dashes (common formatting) before validating
  const digitsOnly = cardNumber.replace(/[\s\-]/g, '');
  const cardRegex = /^\d{16}$/;
  if (!cardRegex.test(digitsOnly)) {
    return 'Credit card number must be exactly 16 digits.';
  }
  return null;
};

/**
 * Check 4 — Calculate total price from cart items.
 * Multiplies price × quantity (defaults to 1 if quantity not provided).
 *
 * @param {Array} items - Validated cart items array
 * @returns {number} Total price rounded to 2 decimal places
 */
const calculateTotal = (items) => {
  const total = items.reduce((sum, item) => {
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    return sum + (item.price * qty);
  }, 0);
  return Math.round(total * 100) / 100; // round to 2 decimals
};

/**
 * Save order to orders.json (the "Save Order" step).
 * This is wrapped in try...catch in the route handler —
 * if this fails, the cart is NOT cleared on the frontend.
 *
 * @param {Object} order - The order object to save
 * @throws {Error} if file read/write fails
 */
const saveOrder = (order) => {
  // Initialize file if it doesn't exist yet
  if (!fs.existsSync(ORDERS_PATH)) {
    fs.writeFileSync(ORDERS_PATH, '[]');
  }
  const orders = JSON.parse(fs.readFileSync(ORDERS_PATH, 'utf8'));
  orders.push(order);
  fs.writeFileSync(ORDERS_PATH, JSON.stringify(orders, null, 2));
};

// ─────────────────────────────────────────────
// POST /api/checkout
// ─────────────────────────────────────────────

router.post('/', (req, res) => {
  // Destructure expected fields from request body
  const { cartItems, email, cardNumber } = req.body;

  // Collect all field-level errors before responding
  // This lets us return ALL errors at once instead of one at a time
  const errors = {};

  // Check 1: Validate cart items
  const cartError = validateCartItems(cartItems);
  if (cartError) errors.cartItems = cartError;

  // Check 2: Validate email with regex
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  // Check 3: Validate 16-digit credit card number
  const cardError = validateCardNumber(cardNumber);
  if (cardError) errors.cardNumber = cardError;

  // If ANY validation failed → send 400 with specific error messages
  // IMPORTANT: the frontend should NOT clear the cart when this happens
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Your cart has NOT been cleared.',
      errors   // e.g. { email: "Invalid email format.", cardNumber: "Must be 16 digits." }
    });
  }

  // Check 4: Calculate total from valid cart items
  const total = calculateTotal(cartItems);

  // Build the order object
  const newOrder = {
    id: Date.now().toString(),           // simple unique ID using timestamp
    email: email.trim(),
    cardLast4: cardNumber.replace(/[\s\-]/g, '').slice(-4), // store only last 4 digits
    items: cartItems,
    total,
    date: new Date().toISOString()
  };

  // ── try...catch: Save Order step ──────────────────────────────────────────
  // If saving fails (disk error, corrupt JSON, etc.) we return 400 and tell
  // the frontend to KEEP the cart — the user can try again without re-adding items.
  try {
    saveOrder(newOrder);

    // Success → 201 Created
    // The frontend should clear the cart ONLY after receiving this response
    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        id:    newOrder.id,
        email: newOrder.email,
        total: newOrder.total,
        items: newOrder.items,
        date:  newOrder.date
      }
    });

  } catch (saveError) {
    // Save Order failed — return 400 with a clear error
    // DO NOT clear the user's cart on the frontend when this error is received
    return res.status(400).json({
      success: false,
      message: 'Order could not be saved. Please try again. Your cart has been kept.',
      errors: {
        server: saveError.message
      }
    });
  }
});

module.exports = router;