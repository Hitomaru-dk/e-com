/**
 * routes/checkout.js — เชื่อม URL กับ controller เท่านั้น
 * เทียบกับของเดิมที่มี ~120 บรรทัดของ validation + saveOrder ปนอยู่
 */
const express             = require('express');
const router              = express.Router();
const checkoutController  = require('../controllers/checkoutController');

router.post('/', checkoutController.checkout);

module.exports = router;