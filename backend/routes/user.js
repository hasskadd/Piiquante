const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const password = require('../middlewares/password');
const emailValidator = require('../middlewares/regexEmail');

router.post('/signup',emailValidator,password, userCtrl.signUp);
router.post('/login', userCtrl.login);

module.exports = router;
