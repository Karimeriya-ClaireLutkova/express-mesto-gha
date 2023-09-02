const Card = require('../models/card');
module.exports.createCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({name, link, owner: req.user._id})
    .then(card => res.send(card))
    .catch(err => {
      if(err.name === 'ValidationError') {
        return res.status(400).send({messege: `${err.name}: 'Введены неверные данные'`});
      } else {
        return res.status(500).send({messege: 'Произошла ошибка'});
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
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$addToSet: {likes: req.user._id}},
    {new: true}
  )
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    {$pull: {likes: req.user._id}},
    {new: true}
  )
  .then(card => res.send({ data: card }))
  .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
};