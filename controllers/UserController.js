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

// 获取单个用户信息
exports.getUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.getById(userId);
        
        if (!user) {
            console.error('❌ 用户未找到');
            return res.status(404).json({ message: '用户未找到' });
        }

        // 格式化创建时间
        const formattedUser = {
            ...user,
            CreatedAt: formatDate(new Date(user.CreatedAt))
        };

        res.json(formattedUser);
    } catch (error) {
        console.error('❌ 获取用户信息失败:', error.message);
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

// 修改用户密码
exports.changePassword = async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;

    try {
        // 获取当前用户信息
        const user = await User.getById(userId);
        if (!user) {
            return res.status(404).json({ message: '用户未找到' });
        }

        // 验证当前密码是否正确
        const isPasswordValid = await bcrypt.compare(currentPassword, user.Password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: '当前密码不正确' });
        }

        // 更新密码
        await User.updatePassword(userId, newPassword);
        res.json({ message: '密码已成功更改' });
    } catch (error) {
        console.error('❌ 修改密码失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};
