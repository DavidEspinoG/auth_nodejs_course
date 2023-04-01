const boom = require('@hapi/boom');
const { config } = require('../config/config');

function checkApiKey (req, res, next) {
  const api = req.headers['api'];
  if (api === config.apiKey) {
    next()
  } else {
    next(boom.unauthorized());
  }
}

module.exports = { checkApiKey };