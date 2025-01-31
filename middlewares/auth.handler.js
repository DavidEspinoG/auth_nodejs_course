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

function checkAdminRole (req, res, next) {
  const user = req.user; 
  if( user.role === 'admin') {
    next()
  } else {
    next(boom.forbidden());
  }
};

function checkRoles(roles) {
  return (req, res, next) => {
    const user = req.user; 
    if( roles.includes(user.role)) {
      next()
    } else {
      next(boom.forbidden());
    }
  }
}
module.exports = { checkApiKey, checkAdminRole };