const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/users');
const bodyParser = require('body-parser');
const {PORT = 3000} = process.env;
const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb',{
  useNewUrlParser: true
});
app.use(bodyParser.json());
app.use(router);
app.listen(PORT, () => {
  console.log(`App listening ${PORT}`)
});