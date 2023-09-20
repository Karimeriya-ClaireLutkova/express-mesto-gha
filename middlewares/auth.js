const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const secretJwtKey = require('../utils/constants');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  console.log(token);
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация.'));
  }
  let payload;

  try {
    payload = jwt.verify(token, secretJwtKey);
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }
  console.log(payload);
  req.user = payload;
  return next();
};
