const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^https?:\/\/(www\.)[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }).unknown(true),
}), createCard);
router.get('/cards', getCards);
router.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), likeCard);
router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
