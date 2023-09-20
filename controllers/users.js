const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((data) => {
      const user = data;
      user.password = undefined;
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        next(err);
      }
    });
};
module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true }).end();
      res.send({ jwt: token });
    })
    .catch(() => {
      res.status(401).send({ message: 'Передан неверный логин или пароль.' });
    });
};
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка.' }));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'Not Found Error') {
        res.status(err.statusCode).send({ message: `${err.message}` });
      }
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные.' });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'Not Found Error') {
        res.status(err.statusCode).send({ message: `${err.message}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError('Запрашиваемый пользователь не найден.');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'Not Found Error') {
        res.status(err.statusCode).send({ message: `${err.message}` });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка.' });
      }
    });
};
