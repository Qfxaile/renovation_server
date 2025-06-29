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

// 测试数据库连接
pool.getConnection()
    .then(conn => {
        console.log('数据库连接成功');
        conn.release();
    })
    .catch(err => console.error('数据库连接失败:', err));

// 路由
app.use('/api', auth, apiRoutes);

// 错误处理
app.use(errorHandler);

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});