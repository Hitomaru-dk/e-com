/**
 * controllers/checkoutController.js
 *
 * Controller — ก่อนหน้านี้ logic ทั้งหมด (validate + save) อยู่ใน routes/checkout.js
 * ตอนนี้ controller นี้แค่รับ request และ delegate ไปให้ orderService ทำงาน
 *
 * สิ่งที่เปลี่ยน: routes/checkout.js กลายเป็นแค่ 3 บรรทัด
 * สิ่งที่ได้: test orderService ได้โดยไม่ต้อง mock Express
 */

const orderService = require('../services/orderService');

/**
 * POST /api/checkout
 */
const checkout = async (req, res) => {
  try {
    const result = await orderService.processCheckout(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Your cart has NOT been cleared.',
        errors: result.errors
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: result.order
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: 'Order could not be saved. Please try again. Your cart has been kept.',
      errors: { server: err.message }
    });
  }
};

module.exports = { checkout };