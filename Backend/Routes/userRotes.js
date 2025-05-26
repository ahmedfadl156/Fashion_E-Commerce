const express = require('express');
const router = express.Router();
const userController = require('../Controllers/user.controller');

router.get('/all', userController.getall);
router.delete('/:id', userController.delete);
router.post('/add' , userController.add);
router.post('/register', userController.register);
router.post('/login', userController.login);

module.exports = router;