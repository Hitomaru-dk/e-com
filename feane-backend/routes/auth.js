/**
 * routes/auth.js — เชื่อม URL กับ controller เท่านั้น
 */
const express        = require('express');
const router         = express.Router();
const authController = require('../controllers/authController');

router.post('/login',    authController.login);
router.post('/register', authController.register);

module.exports = router;