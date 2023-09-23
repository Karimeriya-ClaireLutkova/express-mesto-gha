const allowedCors = [
  'https://practical.mesto.students.nomoredomainsrocks.ru',
  'http://practical.mesto.students.nomoredomainsrocks.ru',
  'https://localhost:3000',
  'http://localhost:3000',
  'https://api.pract.mesto.students.nomoredomainsrocks.ru',
  'http://api.pract.mesto.students.nomoredomainsrocks.ru',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
const { JWT_SECRET } = process.env;
const { NODE_ENV } = process.env;

module.exports = {
  allowedCors,
  DEFAULT_ALLOWED_METHODS,
  JWT_SECRET,
  NODE_ENV,
};
