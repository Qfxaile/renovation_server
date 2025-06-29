const jwt = require('jsonwebtoken');
require('dotenv').config();

// 模拟用户（用于测试）
const mockUser = {
  id: 1,
  username: 'admin',
  role: 'admin'
};

exports.login = (req, res) => {
  const { username, password } = req.body;
  console.log('收到登录请求:', { username, password });

  // 简单模拟验证（你可以替换成数据库查询）
  if (username === 'admin' && password === 'password123') {
    const token = jwt.sign({ id: mockUser.id, username: mockUser.username }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ token });
  } else {
    res.status(401).json({ message: '用户名或密码错误' });
  }
};