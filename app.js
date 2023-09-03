const express = require('express');
const mongoose = require('mongoose');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const bodyParser = require('body-parser');
const {PORT = 3000} = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb',{
  useNewUrlParser: true
});
app.use(bodyParser.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64f0deba4f8d9727e984ee7b'
  };
  next();
});
app.use(routerUsers);
app.use(routerCards);
app.listen(PORT, () => {
  console.log(`App listening ${PORT}`)
});