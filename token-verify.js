const jwt = require('jsonwebtoken');
const token = require('./token-sign');
const secret = 'mycat';

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

const payload = verifyToken(token, secret);

console.log(payload);
