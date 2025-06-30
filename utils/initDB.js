const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 读取 init.sql 文件内容
const sqlFilePath = path.resolve(__dirname, 'mysql', 'init.sql');
const sqlStatements = fs.readFileSync(sqlFilePath, 'utf8')
    .split(';')
    .filter(stmt => stmt.trim());

const DEFAULT_ADMIN = {
    Username: 'admin',
    Password: 'admin123',
    Role: 'admin'
};

async function executeSQL() {
    try {
        console.log('🔧 正在执行数据库结构初始化...');

        for (const stmt of sqlStatements) {
            await pool.query(stmt);
        }

        console.log('✅ 数据库结构已成功初始化');
    } catch (error) {
        console.error('❌ 数据库结构初始化失败:', error.message);
        throw error;
    }
}

async function initializeAdminUser() {
    try {
        console.log('🔍 正在检查管理员账户是否存在...');

        const existingUser = await User.getByUsername(DEFAULT_ADMIN.Username);

        if (!existingUser) {
            console.log('⚠️ 未找到管理员账户，正在创建默认管理员...');

            const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.Password, 10);
            await User.create({
                Username: DEFAULT_ADMIN.Username,
                Password: hashedPassword,
                Role: DEFAULT_ADMIN.Role
            });

            console.log('✅ 默认管理员账户已成功创建');
        } else {
            console.log('✅ 管理员账户已存在，跳过初始化');
        }
    } catch (error) {
        console.error('❌ 数据库初始化失败:', error.message);
    }
}

async function initializeDatabase() {
    try {
        // 先执行 SQL 初始化数据库结构
        await executeSQL();

        // 再初始化默认管理员账户
        await initializeAdminUser();
    } catch (error) {
        console.error('❌ 数据库整体初始化失败:', error.message);
    }
}

module.exports = initializeDatabase;