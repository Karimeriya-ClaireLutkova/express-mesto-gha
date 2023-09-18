const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();
const DATABASE_URL = 'mongodb://127.0.0.1:27017/mestodb';
mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64f0deba4f8d9727e984ee7b',
  };
  next();
});

app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use(routerUsers);
app.use(routerCards);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});
app.listen(PORT);
