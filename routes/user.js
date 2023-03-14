const express = require('express');
// utilisation du middleware pour gérer les routes et les endpoints
const router = express.Router();

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;
