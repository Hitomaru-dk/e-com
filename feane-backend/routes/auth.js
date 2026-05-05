/**
 * auth.js — Route layer
 * Defines all authentication-related API endpoints.
 * Delegates logic to authController (separation of concerns).
 *
 * GenAI Prompt used to generate this:
 * "Generate an Express.js route file for user registration.
 *  POST /register should accept { name, username, password },
 *  validate fields are present, and call registerUser() from the service layer.
 *  Return 201 on success, 400 if fields missing, 409 if email already exists."
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
// Validates credentials against users.json and auth_user.json
router.post('/login', authController.login);

// POST /api/auth/register
// Creates a new user entry in auth_user.json
router.post('/register', authController.register);

module.exports = router;