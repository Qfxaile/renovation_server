const AccountBook = require('../models/AccountBook');
const formatDate = require('../utils/dateUtils');

exports.getAllAccountBooks = async (req, res) => {
    try {
        console.log('🔍 正在获取所有流水账');
        const accountBooks = await AccountBook.getAll();

        // 格式化所有记录中的创建时间
        const formattedBooks = accountBooks.map(book => ({
            ...book,
            Date: book.Date ? formatDate(new Date(book.Date)) : ''
        }));

        res.json(formattedBooks);
    } catch (error) {
        console.error('❌ 获取流水账列表失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

exports.getAccountBookById = async (req, res) => {
    const { bookId } = req.params;

    try {
        console.log(`🔍 正在获取流水账: ${bookId}`);
        const accountBook = await AccountBook.getById(bookId);

        if (!accountBook) {
            console.error('❌ 流水账未找到');
            return res.status(404).json({ message: '流水账未找到' });
        }

        // 格式化所有记录中的创建时间
        const formattedBook = {
            ...accountBook,
            Date: accountBook.Date ? formatDate(new Date(accountBook.Date)) : ''
        };

        res.json(formattedBook);
    } catch (error) {
        console.error('❌ 获取流水账信息失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

exports.getAccountBooksByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        console.log(`🔍 正在获取用户流水账: ${userId}`);
        const accountBooks = await AccountBook.getByUserId(userId);

        // 格式化所有记录中的创建时间
        const formattedBooks = accountBooks.map(book => ({
            ...book,
            Date: book.Date ? formatDate(new Date(book.Date)) : ''
        }));

        res.json(formattedBooks);
    } catch (error) {
        console.error('❌ 获取用户流水账失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

exports.createAccountBook = async (req, res) => {
    try {
        const { UserID, Title, Description, Date } = req.body;

        if (!UserID || !Title) {
            console.error('❌ 创建流水账失败: 缺少必填字段');
            return res.status(400).json({ message: '缺少必填字段' });
        }

        console.log('➕ 正在创建新流水账:', req.body);
        const bookId = await AccountBook.create({ UserID, Title, Description, Date });
        res.status(201).json({ message: '流水账创建成功', bookId });
    } catch (error) {
        console.error('❌ 创建流水账失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新流水账
exports.updateAccountBook = async (req, res) => {
    const { bookId } = req.params;
    const updateData = req.body;
    try {
        console.log('🔧 正在更新流水账:', { bookId, updateData });
        await AccountBook.update(bookId, updateData);
        res.json({ message: '流水账更新成功' });
    } catch (error) {
        console.error('❌ 更新流水账失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除流水账
exports.deleteAccountBook = async (req, res) => {
    const { bookId } = req.params;

    try {
        console.log(`🗑️ 正在删除流水账: ${bookId}`);
        const success = await AccountBook.delete(bookId);

        if (!success) {
            console.error('❌ 删除流水账失败: 流水账不存在');
            return res.status(404).json({ message: '流水账不存在' });
        }

        res.json({ message: '流水账删除成功' });
    } catch (error) {
        console.error('❌ 删除流水账失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};