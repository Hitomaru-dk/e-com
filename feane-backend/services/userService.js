const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_PATH     = path.join(__dirname, '../data/users.json');
const AUTH_USER_PATH = path.join(__dirname, '../data/auth_user.json');

const hashPassword = (pw) => crypto.createHash('md5').update(pw).digest('hex');

/** Load all users from both files */
const getAllUsers = () => {
  const original = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
  const registered = JSON.parse(fs.readFileSync(AUTH_USER_PATH, 'utf8'));
  return [...original, ...registered];
};

/** Load only registered users (auth_user.json) */
const getAuthUsers = () => JSON.parse(fs.readFileSync(AUTH_USER_PATH, 'utf8'));

/** Find user by email across both files */
const findUserByUsername = (username) => {
  return getAllUsers().find(u => u.username === username) || null;
};

/** Validate login credentials */
const validateUser = (username, password) => {
  const user = findUserByUsername(username);
  if (!user) return { success: false, message: 'User not found' };

  if (hashPassword(password) !== user.password)
    return { success: false, message: 'Invalid password' };

  return {
    success: true,
    data: {
      username: user.username,
      first_name: user.first_name,
      date_of_registration: user.date_of_registration
    }
  };
};

/** Register new user — checks duplicate in both files, saves to auth_user.json */
const registerUser = (name, username, password) => {
  const existing = findUserByUsername(username);
  if (existing) return { success: false, message: 'Email already registered' };

  const newUser = {
    username,
    password: hashPassword(password),
    first_name: name,
    date_of_registration: new Date().toISOString().split('T')[0]
  };

  const authUsers = getAuthUsers();
  authUsers.push(newUser);
  fs.writeFileSync(AUTH_USER_PATH, JSON.stringify(authUsers, null, 2));

  return {
    success: true,
    data: {
      username: newUser.username,
      first_name: newUser.first_name,
      date_of_registration: newUser.date_of_registration
    }
  };
};

module.exports = { validateUser, registerUser, findUserByUsername };