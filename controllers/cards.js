const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send(card))
    .catch(err => {
      if(err.name === 'ValidationError') {
        res.status(400).send({message: 'Переданы некорректные данные при создании карточки'});
      } else {
        res.status(500).send({message: 'Произошла ошибка'});
      }
    });
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.deleteCard = (req, res) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card)=> {
      if(card === null) {
        throw new NotFoundError('Запрашиваемая карточка не найдена');
      }
      if(card.owner.toString() !== owner) {
        throw new ForbiddenError('Нет прав на удаление карточки');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .populate(['owner', 'likes'])
        .then(card => res.send({ data: card }))
        .catch(err => {
          next(err)
        });
    })
    .catch(err => {
      if (err.name === 'Not Found Error') {
        res.status(err.statusCode).send({message: `${err.message}`});
      }
      if (err.name === 'Forbidden Error') {
        res.status(err.statusCode).send({message: `${err.message}`});
      } else {
        res.status(500).send({message: 'Произошла ошибка'})
      }
    });
};
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
  .then(card => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий _id карточки')
    }
    return res.send({ data: card });
  })
  .catch(err => {
    if (err.name === 'Not Found Error') {
      res.status(err.statusCode).send({message: `${err.message}`});
    }
    if(err.name === 'ValidationError') {
      res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка'})
    } else {
      res.status(500).send({message: 'Произошла ошибка'})
    };
  })
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
  .then(card => {
    if (card === null) {
      throw new NotFoundError('Передан несуществующий _id карточки')
    }
    return res.send({ data: card });
  })
  .catch(err => {
    if (err.name === 'Not Found Error') {
      res.status(err.statusCode).send({message: `${err.message}`});
    }
    if(err.name === 'ValidationError') {
      res.status(400).send({message: 'Переданы некорректные данные для постановки/снятии лайка'})
    } else {
      res.status(500).send({message: 'Произошла ошибка'})
    };
  })
};