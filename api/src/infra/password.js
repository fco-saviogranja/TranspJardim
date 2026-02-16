const crypto = require('node:crypto');

function hashPassword(password) {
  const plain = String(password ?? '');
  if (!plain) throw new Error('Senha vazia não é permitida.');
  const salt = crypto.randomBytes(16).toString('base64url');
  const hash = crypto.scryptSync(plain, salt, 64).toString('base64url');
  return `scrypt$${salt}$${hash}`;
}

function verifyPassword(password, encoded) {
  const plain = String(password ?? '');
  const value = String(encoded ?? '');
  const parts = value.split('$');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const salt = parts[1];
  const expected = Buffer.from(parts[2], 'base64url');
  const actual = crypto.scryptSync(plain, salt, expected.length);
  return crypto.timingSafeEqual(expected, actual);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
