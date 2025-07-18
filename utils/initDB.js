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

// 读取 drop_triggers.sql 文件内容
const dropTriggersFilePath = path.resolve(__dirname, 'mysql', 'triggers', 'drop_triggers.sql');
let dropTriggersStatements = [];

if (fs.existsSync(dropTriggersFilePath)) {
    try {
        const dropTriggersContent = fs.readFileSync(dropTriggersFilePath, 'utf8');
        dropTriggersStatements = dropTriggersContent.split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt);
        
        console.log(`✅ 成功加载 ${dropTriggersStatements.length} 条删除触发器语句`);
    } catch (error) {
        console.error(`❌ 读取 drop_triggers.sql 文件失败: ${error.message}`);
    }
} else {
    console.warn('⚠️ drop_triggers.sql 文件不存在，跳过删除现有触发器步骤');
}

// 读取 update_image.sql 文件内容
const updateImageFilePath = path.resolve(__dirname, 'mysql', 'update.sql');
let updateImageStatements = [];

if (fs.existsSync(updateImageFilePath)) {
    try {
        const updateImageContent = fs.readFileSync(updateImageFilePath, 'utf8');
        updateImageStatements = updateImageContent.split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt);
        
        console.log(`✅ 成功加载 ${updateImageStatements.length} 条数据库更新语句`);
    } catch (error) {
        console.error(`❌ 读取 update_image.sql 文件失败: ${error.message}`);
    }
} else {
    console.warn('⚠️ update_image.sql 文件不存在，跳过数据库结构更新步骤');
}

// 读取 triggers 目录下的所有 SQL 文件
const triggerDirPath = path.resolve(__dirname, 'mysql', 'triggers');
let triggerStatements = [];
let triggerFileCount = 0;

if (fs.existsSync(triggerDirPath)) {
    const allFiles = fs.readdirSync(triggerDirPath);
    const triggerFiles = allFiles.filter(file => file.endsWith('.sql') && file !== 'drop_triggers.sql');
    triggerFileCount = triggerFiles.length;
    
    console.log(`🔍 在触发器目录中找到 ${triggerFileCount} 个SQL文件`);
    
    if (triggerFileCount === 0) {
        console.log('⚠️ 触发器目录中没有找到SQL文件');
    }
    
    for (const file of triggerFiles) {
        const filePath = path.join(triggerDirPath, file);
        try {
            const sqlContent = fs.readFileSync(filePath, 'utf8');
            // 添加文件名注释到SQL内容开头
            const sqlWithComment = `-- File: ${file}\n${sqlContent}`;
            triggerStatements.push(sqlWithComment);
            console.log(`✅ 已加载触发器文件: ${file}`);
        } catch (error) {
            console.error(`❌ 读取触发器文件 ${file} 失败: ${error.message}`);
        }
    }
} else {
    console.error('❌ 触发器目录不存在:', triggerDirPath);
}

// 从 .env 中获取默认管理员账户信息
const DEFAULT_ADMIN = {
    Username: process.env.ADMIN_USERNAME || 'admin',
    Password: process.env.ADMIN_PASSWORD || 'admin123',
    Role: process.env.ADMIN_ROLE || 'admin'
};

async function executeSQL() {
    try {
        console.log('🔧 正在执行数据库结构初始化...');
        
        // 测试数据库连接
        const connection = await pool.getConnection();
        console.log('✅ 数据库连接成功');
        connection.release();
        
        // 执行主SQL文件中的语句
        for (const stmt of sqlStatements) {
            console.log(`📝 正在执行 SQL 语句: ${stmt.trim().substring(0, 50)}...`);
            await pool.query(stmt);
        }

        // 如果存在updateImageStatements，并且.env中配置了UPDATE_DB=true，则执行更新
        const shouldUpdateDB = process.env.UPDATE_DB === 'true';
        if (updateImageStatements.length > 0 && shouldUpdateDB) {
            console.log(`⚡ 正在根据UPDATE_DB配置执行 ${updateImageStatements.length} 条数据库结构更新语句`);
            for (const stmt of updateImageStatements) {
                try {
                    console.log(`📝 正在执行更新语句: ${stmt.trim().substring(0, 50)}...`);
                    await pool.query(stmt);
                } catch (error) {
                    console.warn(`⚠️ 数据库结构更新时发生警告: ${error.message}`);
                }
            }
            console.log('✅ 数据库结构更新完成');
        }

        // 如果存在dropTriggers_statement，则优先逐条执行它
        if (dropTriggersStatements.length > 0) {
            console.log(`🗑️ 正在执行 ${dropTriggersStatements.length} 条删除触发器语句`);
            for (const stmt of dropTriggersStatements) {
                try {
                    console.log(`📝 正在执行删除触发器语句: ${stmt.trim().substring(0, 50)}...`);
                    await pool.query(stmt);
                } catch (error) {
                    console.warn(`⚠️ 删除触发器时发生警告: ${error.message}`);
                }
            }
            console.log('✅ 所有删除触发器语句执行完毕');
        }

        // 执行触发器SQL文件中的语句
        if (triggerStatements.length > 0) {
            console.log(`⚡ 正在执行 ${triggerStatements.length} 个触发器文件`);
            for (const sqlContent of triggerStatements) {
                const lines = sqlContent.split('\n');
                const firstLine = lines[0].trim();
                const fileNameMatch = lines.find(line => line.includes('-- File: '));
                const fileName = fileNameMatch ? fileNameMatch.split(':')[1].trim() : '未知文件';
                
                try {
                    console.log(`📂 正在执行触发器文件: ${fileName}`);
                    console.log(`📝 正在执行触发器语句: ${firstLine.substring(0, 50)}...`);
                    await pool.query(sqlContent);
                } catch (error) {
                    console.warn(`⚠️ 创建触发器时发生警告: ${error.message}`);
                }
            }
            console.log('✅ 所有触发器文件执行完毕');
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