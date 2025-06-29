require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./config/db');
const auth = require('./middlewares/auth');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(auth)

// 测试数据库连接
pool.getConnection()
  .then(conn => {
    console.log('数据库连接成功');
    conn.release();
  })
  .catch(err => console.error('数据库连接失败:', err));

// 初始化数据库表
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS records (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount DECIMAL(10,2) NOT NULL,
      type ENUM('income', 'expense') NOT NULL,
      category VARCHAR(50) NOT NULL,
      description TEXT,
      user_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);
};
initDB();

// 路由
app.use('/api', apiRoutes);

// 错误处理
app.use(errorHandler);

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});