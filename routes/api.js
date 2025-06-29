const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const recordController = require('../controllers/recordController');

// 用户认证路由
router.post('/login', (req, res) => {
  // 实际实现中需要验证用户名密码
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

// 需要认证的路由
router.use(auth);
router.post('/records', recordController.createRecord);
router.get('/records', recordController.getRecords);

module.exports = router;