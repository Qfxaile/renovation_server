const User = require('../models/User');
const formatDate = require('../utils/dateUtils');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        
        // 格式化所有用户记录中的创建时间
        const formattedUsers = users.map(user => ({
            ...user,
            CreatedAt: formatDate(new Date(user.CreatedAt))
        }));
        
        res.json(formattedUsers);
    } catch (error) {
        console.error('❌ 获取用户列表失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取所有管理员用户
exports.getAdminUsers = async (req, res) => {
    try {
        const adminUsers = await User.getByRole('admin');
        res.json(adminUsers);
    } catch (error) {
        console.error('❌ 获取管理员用户失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};