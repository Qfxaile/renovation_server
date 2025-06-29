module.exports = (err, req, res, next) => {
  console.error('服务器错误:', err.stack);
  
  // 根据错误类型返回响应
  const statusCode = err.statusCode || 500;
  const message = err.message || '内部服务器错误';
  
  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: message
    }
  });
};