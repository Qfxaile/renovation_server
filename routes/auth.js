// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// 公共接口，不需要认证
router.post('/login', authController.login);
router.get('/verify', authController.verify);

module.exports = router;