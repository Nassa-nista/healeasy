const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'please_change_me';

function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '1h' });
}

function verify(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { sign, verify };
