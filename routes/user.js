const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const emailCtrl = require("../middleware/emailCtrl");
const passwordCtrl = require('../middleware/passwordCtrl');

router.post('/signup',emailCtrl, passwordCtrl, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;