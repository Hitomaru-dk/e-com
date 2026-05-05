/**
 * registerService.js — Register Service (register.js logic)
 * Handles all business logic for user registration.
 *
 * GenAI Prompt used to generate this:
 * "Write a Node.js service module called registerService.js for user registration.
 *  It should:
 *  1. Read auth_user.json to check if the email (username) already exists.
 *  2. If duplicate found, return { success: false, message: 'Email already registered' }.
 *  3. If not found, hash the password with MD5 using crypto module.
 *  4. Build a new user object { username, password (hashed), first_name, date_of_registration }.
 *  5. Append to auth_user.json using fs.writeFileSync.
 *  6. Return { success: true, data: { username, first_name, date_of_registration } }.
 *  Ensure all comments explain each step clearly."
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Path to the registered users storage file
const AUTH_USER_PATH = path.join(__dirname, '../data/auth_user.json');

// Path to the pre-seeded users file (users.json from earlier task)
const USERS_PATH = path.join(__dirname, '../data/users.json');

/**
 * Hash a plain-text password using MD5.
 * Note: MD5 is used here for educational purposes.
 * In production, always use bcrypt or argon2.
 *
 * @param {string} password - Plain text password from the registration form
 * @returns {string} MD5 hex hash string
 */
const hashPassword = (password) => {
  return crypto.createHash('md5').update(password).digest('hex');
};

/**
 * Load all users from both data files.
 * Combines the original seed users (users.json) and
 * newly registered users (auth_user.json) for duplicate checking.
 *
 * @returns {Array} Combined array of all user objects
 */
const getAllUsers = () => {
  const original   = JSON.parse(fs.readFileSync(USERS_PATH,     'utf8'));
  const registered = JSON.parse(fs.readFileSync(AUTH_USER_PATH, 'utf8'));
  return [...original, ...registered];
};

/**
 * Register a new user.
 * Steps:
 *   1. Check for existing email across both user files (Contract: unique username)
 *   2. Hash the password with MD5 (Contract: never store plain text)
 *   3. Build new user object with auto-generated date_of_registration
 *   4. Append to auth_user.json and persist to disk
 *   5. Return user data (without password hash) on success
 *
 * @param {string} name     - User's first name
 * @param {string} username - User's email address (acts as unique username)
 * @param {string} password - Plain text password (will be hashed before storage)
 * @returns {{ success: boolean, message?: string, data?: Object }}
 */
const registerUser = (name, username, password) => {

  // Step 1: Check for duplicate email (backend contract check)
  const allUsers = getAllUsers();
  const existing = allUsers.find(u => u.username === username);
  if (existing) {
    // 409 Conflict — email already registered
    return { success: false, message: 'Email already registered' };
  }

  // Step 2: Hash the password — never store plain text
  const hashedPassword = hashPassword(password);

  // Step 3: Build the new user record
  const newUser = {
    username,                                              // email = unique login key
    password: hashedPassword,                              // MD5 hashed password
    first_name: name,                                      // display name
    date_of_registration: new Date().toISOString().split('T')[0]  // YYYY-MM-DD
  };

  // Step 4: Read current auth_user.json, append, and write back
  const authUsers = JSON.parse(fs.readFileSync(AUTH_USER_PATH, 'utf8'));
  authUsers.push(newUser);
  fs.writeFileSync(AUTH_USER_PATH, JSON.stringify(authUsers, null, 2));

  // Step 5: Return safe user data (never expose the password hash)
  return {
    success: true,
    data: {
      username: newUser.username,
      first_name: newUser.first_name,
      date_of_registration: newUser.date_of_registration
    }
  };
};

module.exports = { registerUser };