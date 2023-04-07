const jwt = require('jsonwebtoken');

const secret = 'cat';

const payload = {
  sub: 1,
  message: 'superSecret',
}

function signToken(payload, secret) {
  return jwt.sign(payload, secret);
}

const token = signToken(payload, secret);
console.log(token)
module.exports = token;