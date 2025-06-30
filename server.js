require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pool = require('./config/db');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errorHandler');
const initializeDatabase = require('./utils/initDB');

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());

// 测试数据库连接
pool.getConnection()
    .then(conn => {
        console.log('数据库连接成功');
        conn.release();
    })
    .catch(err => console.error('数据库连接失败:', err));

// 执行初始化数据库
initializeDatabase();

// 不需要认证的路由
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // 不经过 auth 中间件

// 需要认证的其他路由
const apiRoutes = require('./routes/api');
app.use('/api', auth, apiRoutes); // 经过 auth 中间件

// 错误处理
app.use(errorHandler);

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});