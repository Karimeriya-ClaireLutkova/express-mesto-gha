const Card = require('../models/card');
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  const owner = req.user._id;
  Card.create({name, link, owner})
    .then(card => res.send({data: card}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.getCards = (req, res) => {
  Card.find({})
    .then(cards => res.send({data: cards}))
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};
module.exports.deleteCard = (req, res) => {
  const owner = req.user._id;
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() !== owner) {
        throw new AccessError('Нет прав на удаление карточки')
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .populate(['owner', 'likes'])
        .then(card => res.send({ data: card }))
        .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
    })
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};