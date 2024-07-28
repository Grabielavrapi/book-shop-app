const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

function createJSONToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function isValidPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

module.exports = { createJSONToken, isValidPassword };
