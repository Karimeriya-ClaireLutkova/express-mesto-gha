const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          validator.isEmail(email);
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false },
);
userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (user === null) {
        return Promise.reject(new UnauthorizedError('Передан неверный логин или пароль.'));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new UnauthorizedError('Передан неверный логин или пароль.'));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
