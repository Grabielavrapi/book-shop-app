function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidText(text, minLength) {
  return typeof text === 'string' && text.trim().length >= minLength;
}

module.exports = { isValidEmail, isValidText };
