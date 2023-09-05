const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const { DATABASE_URL } = require('./utils/constants');

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64f0deba4f8d9727e984ee7a',
  };
  next();
});
app.use(routerUsers);
app.use(routerCards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});
app.listen(PORT);
