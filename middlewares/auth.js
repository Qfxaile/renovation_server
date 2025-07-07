const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.error('认证失败:', '未提供认证令牌'); // 添加认证失败日志
    return res.status(401).json({ error: '未提供认证令牌' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: user_id }
    // console.log('认证成功:', { user: req.user }); // 添加认证成功日志
    next();
  } catch (err) {
    console.error('认证失败:', '无效的令牌'); // 添加认证失败日志
    res.status(401).json({ error: '无效的令牌' });
  }
};