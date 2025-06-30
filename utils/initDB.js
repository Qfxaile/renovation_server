const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const userService = require('../services/userService');

// 读取 init.sql 文件内容
const sqlFilePath = path.resolve(__dirname, 'mysql', 'init.sql');
const sqlStatements = fs.readFileSync(sqlFilePath, 'utf8')
    .split(';')
    .filter(stmt => stmt.trim());

// 从 .env 中获取默认管理员账户信息
const DEFAULT_ADMIN = {
    Username: process.env.ADMIN_USERNAME || 'admin',
    Password: process.env.ADMIN_PASSWORD || 'admin123',
    Role: process.env.ADMIN_ROLE || 'admin'
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

        const adminUsers = await userService.getAllAdmins();

        if (!adminUsers || adminUsers.length === 0) {
            console.log('⚠️ 未找到管理员账户，正在创建默认管理员...');

            const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN.Password, 10);
            await User.create({
                Username: DEFAULT_ADMIN.Username,
                Password: hashedPassword,
                Role: DEFAULT_ADMIN.Role
            });

            console.log('✅ 默认管理员账户已成功创建');
        } else {
            // 使用 service 获取管理员列表
            const adminUsers = await userService.getAllAdmins();
            // 存在一个或多个管理员账户，保留第一个并同步其信息
            const existingAdmin = adminUsers[0];

            console.log(`✅ 发现管理员账户：${existingAdmin.Username}，正在校验一致性...`);

            let needUpdate = false;
            const updateData = {};

            // 检查用户名是否一致
            if (existingAdmin.Username !== DEFAULT_ADMIN.Username) {
                console.log(`⚠️ 管理员用户名不一致，将从 "${existingAdmin.Username}" 更新为 "${DEFAULT_ADMIN.Username}"`);
                updateData.Username = DEFAULT_ADMIN.Username;
                needUpdate = true;
            }

            // 检查密码是否一致
            const isPasswordMatch = await bcrypt.compare(DEFAULT_ADMIN.Password, existingAdmin.Password);
            if (!isPasswordMatch) {
                console.log('⚠️ 管理员密码不一致，正在更新密码...');
                updateData.Password = await bcrypt.hash(DEFAULT_ADMIN.Password, 10);
                needUpdate = true;
            }

            // 删除多余的管理员账户（如果存在）
            if (adminUsers.length > 1) {
                const idsToDelete = adminUsers.slice(1).map(u => u.UserID);
                console.log(`⚠️ 发现 ${idsToDelete.length} 个多余管理员账户，正在删除...`);
                await pool.query('DELETE FROM Users WHERE UserID IN (?)', [idsToDelete]);
                console.log('✅ 多余的管理员账户已删除');
            }

            // 如果需要更新，则执行更新
            if (needUpdate) {
                await User.update(existingAdmin.UserID, updateData);
                console.log('✅ 管理员账户信息已同步更新');
            } else {
                console.log('✅ 管理员账号和密码保持一致，无需更新');
            }
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