// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// 公共接口，不需要认证
router.post('/login', authController.login);
router.post('/register', authController.register); // 添加注册路由
router.get('/verify', authController.verify);

module.exports = router;