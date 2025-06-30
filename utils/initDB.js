const User = require('../models/User');
const bcrypt = require('bcrypt');

const DEFAULT_ADMIN = {
    Username: 'admin',
    Password: 'admin123',
    Role: 'admin'
};

async function initializeDatabase() {
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

module.exports = initializeDatabase;