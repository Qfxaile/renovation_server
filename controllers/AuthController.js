const jwt = require('jsonwebtoken');
require('dotenv').config(); // 引入环境变量配置
const User = require('../models/User'); // 使用模型层
const bcrypt = require('bcrypt'); // 保留 bcrypt 做密码比较

exports.login = async (req, res) => {
  const { username, password } = req.body;
  console.log('收到登录请求:', { username, password }); // 添加登录请求日志

  try {
    // 使用 User 模型中的 getByUsername 方法查找用户
    const user = await User.getByUsername(username);

    if (!user) {
      console.error('登录失败:', '用户名或密码错误'); // 用户不存在
      return res.status(401).json({ message: '用户名或密码错误' });
    }

    // 使用 bcrypt 比较密码
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (isPasswordValid) {
      // 生成JWT令牌
      const token = jwt.sign({ id: user.UserID, username: user.Username }, process.env.JWT_SECRET, {
      });
      console.log('登录成功:', { username: user.Username }); // 添加登录成功日志

      res.json({ token });
    } else {
      console.error('登录失败:', '用户名或密码错误'); // 密码不匹配
      res.status(401).json({ message: '用户名或密码错误' });
    }
  } catch (error) {
    console.error('登录处理错误:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

exports.verify = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ valid: false, message: '无效的授权头' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch (error) {
    res.status(401).json({ valid: false, message: '无效的令牌' });
  }
};
