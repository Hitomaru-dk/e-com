/**
 * controllers/authController.js
 *
 * Controller — รับผิดชอบแค่ HTTP layer
 * - รับ req.body
 * - เรียก service
 * - ส่ง HTTP response กลับ
 *
 * ไม่มี business logic ในนี้เลย
 * การเปลี่ยน HTTP status code หรือ response shape ทำที่นี่ที่เดียว
 */

const userService = require('../services/userService');

/**
 * POST /api/auth/login
 */
const login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username and password are required' });

    const result = userService.validateUser(username, password);
    if (!result.success)
      return res.status(401).json({ success: false, message: result.message });

    return res.status(200).json({ success: true, message: 'Login successful', data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * POST /api/auth/register
 */
const register = (req, res) => {
  try {
    const { name, username, password } = req.body;
    if (!name || !username || !password)
      return res.status(400).json({ success: false, message: 'Name, username, and password are required' });

    const result = userService.registerUser(name, username, password);
    if (!result.success)
      return res.status(409).json({ success: false, message: result.message });

    return res.status(201).json({ success: true, message: 'Registration successful', data: result.data });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { login, register };