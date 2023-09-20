const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Запрашиваемая карточка не найдена.');
      }
      if (card.owner.toString() !== owner) {
        next(new ForbiddenError('Нет прав на удаление карточки.'));
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .populate(['owner', 'likes'])
        .then(() => res.send({ data: card }))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'Not Found Error') {
        next(new NotFoundError('Запрашиваемая карточка не найдена.'));
      }
      if (err.name === 'Forbidden Error') {
        next(new ForbiddenError('Нет прав на удаление карточки.'));
      }
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new ValidationError('Переданы некорректные данные при удалении карточки.'));
      } else {
        next(err);
      }
    });
};
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Not Found Error') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Not Found Error') {
        next(new NotFoundError('Передан несуществующий _id карточки.'));
      }
      if ((err.name === 'ValidationError') || (err.name === 'CastError')) {
        next(new ValidationError('Переданы некорректные данные для постановки/снятии лайка.'));
      } else {
        next(err);
      }
    });
};
