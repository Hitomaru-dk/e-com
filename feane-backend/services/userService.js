const crypto         = require('crypto');
const userRepository = require('../repositories/userRepository');

const hashPassword = (pw) => crypto.createHash('md5').update(pw).digest('hex');

const validateUser = (username, password) => {
  const user = userRepository.findByUsername(username);
  if (!user) return { success: false, message: 'User not found' };
  if (hashPassword(password) !== user.password)
    return { success: false, message: 'Invalid password' };
  return {
    success: true,
    data: {
      username:             user.username,
      first_name:           user.first_name,
      date_of_registration: user.date_of_registration
    }
  };
};

const registerUser = (name, username, password) => {
  if (userRepository.findByUsername(username))
    return { success: false, message: 'Email already registered' };
  const newUser = {
    username,
    password:             hashPassword(password),
    first_name:           name,
    date_of_registration: new Date().toISOString().split('T')[0]
  };
  userRepository.save(newUser);
  return {
    success: true,
    data: {
      username:             newUser.username,
      first_name:           newUser.first_name,
      date_of_registration: newUser.date_of_registration
    }
  };
};

module.exports = { validateUser, registerUser };