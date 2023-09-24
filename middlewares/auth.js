const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { Authorization } = req.headers;
  console.log(req.headers);
  if (!Authorization || !Authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Неправильные почта или пароль'));
  }
  const token = Authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация.'));
  }
  req.user = payload;
  console.log(req.user);
  return next();
};
