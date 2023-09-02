const User = require('../models/user');
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const {name, about} = req.body;
  User.findByIdAndUpdate(userId, {name, about}, {new: true, runValidators: true})
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'Данные не прошли валидацию либо произошла ошибка'}));
};
module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const {avatar} = req.body;
  User.findByIdAndUpdate(userId, {avatar}, {new: true, runValidators: true})
    .then(user => res.send({data: user}))
    .catch(err => res.status(500).send({message: 'Данные не прошли валидацию либо произошла ошибка'}));
};
