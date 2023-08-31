const router =require('express').Router();
const {createUser} = require('../controllers/users');
router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:userId', getUser);