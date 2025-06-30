const User = require('../models/User');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.getAll();
        res.json(users);
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