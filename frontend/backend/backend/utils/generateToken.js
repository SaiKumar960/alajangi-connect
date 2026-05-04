const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT token for the given user ID
 * @param {string} id - MongoDB ObjectId of the user
 * @returns {string} signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

module.exports = generateToken;
