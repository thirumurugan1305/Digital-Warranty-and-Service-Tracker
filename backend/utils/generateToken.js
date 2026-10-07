const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'warranty_tracker_jwt_secret_key_2026_super_secure', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
