const User = require('../models/user');
module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(400).send({message: `${err.name}: 'Введены неверные данные'`});
      } else {
        return res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};
module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then(user => res.send({data: user}))
    .catch(err => {
      console.log(err.status);
      if(err.status === '404') {
        return res.status(400).send({message: `${err.name}: 'Введены неверные данные'`});
      } else {
        return res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};
module.exports.updateUser = (req, res) => {
  const userId = req.user._id;
  const {name, about} = req.body;
  User.findByIdAndUpdate(userId, {name, about}, {new: true, runValidators: true})
    .then(user => res.send({data: user}))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(400).send({message: `${err.name}: 'Введены неверные данные'`});
      } else {
        return res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};
module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  const {avatar} = req.body;
  User.findByIdAndUpdate(userId, {avatar}, {new: true, runValidators: true})
    .then(user => res.send({data: user}))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(400).send({message: `${err.name}: 'Введены неверные данные'`});
      } else {
        return res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};