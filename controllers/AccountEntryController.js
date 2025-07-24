const AccountEntry = require('../models/AccountEntry');
const formatDate = require('../utils/dateUtils');
const auth = require('../middlewares/auth');

// 获取所有流水账记录
exports.getAllAccountEntries = async (req, res) => {
    try {
        console.log('🔍 正在获取所有流水账记录');
        const entries = await AccountEntry.getAll();
        
        // 格式化所有记录中的日期
        const formattedEntries = entries.map(entry => ({
            ...entry,
            Date: entry.Date ? formatDate(new Date(entry.Date)) : null
        }));
        
        res.json(formattedEntries);
    } catch (error) {
        console.error('❌ 获取流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取单个流水账记录
exports.getAccountEntryById = async (req, res) => {
    const { entryId } = req.params;

    try {
        console.log(`🔍 正在获取流水账记录: ${entryId}`);
        const entry = await AccountEntry.getById(entryId);
        
        if (!entry) {
            console.error('❌ 流水账记录未找到');
            return res.status(404).json({ message: '流水账记录未找到' });
        }

        // 格式化日期
        const formattedEntry = {
            ...entry,
            Date: entry.Date ? formatDate(new Date(entry.Date)) : null
        };

        res.json(formattedEntry);
    } catch (error) {
        console.error('❌ 获取流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 根据流水账ID获取记录
exports.getAccountEntriesByBookId = async (req, res) => {
    const { bookId } = req.params;

    try {
        console.log(`🔍 正在获取流水账记录 (BookID: ${bookId})`);
        const entries = await AccountEntry.getByBookId(bookId);
        
        // 格式化所有记录中的日期
        const formattedEntries = entries.map(entry => ({
            ...entry,
            Date: entry.Date ? formatDate(new Date(entry.Date)) : null
        }));
        
        res.json(formattedEntries);
    } catch (error) {
        console.error('❌ 获取流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 根据用户ID获取记录
exports.getAccountEntriesByUserId = async (req, res) => {
    const { userId } = req.params;

    try {
        console.log(`🔍 正在获取用户流水账记录 (UserID: ${userId})`);
        const entries = await AccountEntry.getByUserId(userId);
        
        // 格式化所有记录中的日期
        const formattedEntries = entries.map(entry => ({
            ...entry,
            Date: entry.Date ? formatDate(new Date(entry.Date)) : null
        }));
        
        res.json(formattedEntries);
    } catch (error) {
        console.error('❌ 获取用户流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 创建新的流水账记录
exports.createAccountEntry = async (req, res) => {
    try {
        const { BookID, UserID, Date, Project, Income, Expense, Notes } = req.body;
        
        if (!BookID || !UserID) {
            console.error('❌ 创建流水账记录失败: 缺少必填字段');
            return res.status(400).json({ message: '缺少必填字段' });
        }
        
        console.log('➕ 正在创建新流水账记录:', req.body);
        const entryId = await AccountEntry.create({ BookID, UserID, Date, Project, Income, Expense, Notes });
        res.status(201).json({ message: '流水账记录创建成功', entryId });
    } catch (error) {
        console.error('❌ 创建流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新流水账记录
exports.updateAccountEntry = async (req, res) => {
    const { entryId } = req.params;
    const updateData = req.body;
    
    // 确保不更新EntryID
    if (updateData.EntryID && updateData.EntryID !== parseInt(entryId)) {
        console.error('❌ 更新流水账记录失败: 不允许修改记录ID');
        return res.status(400).json({ message: '不允许修改记录ID' });
    }
    
    // 删除entryId属性以防止更新
    delete updateData.EntryID;

    try {
        console.log('🔧 正在更新流水账记录:', { entryId, updateData });
        const success = await AccountEntry.update(entryId, updateData);
        
        if (!success) {
            console.error('❌ 更新流水账记录失败: 记录不存在或数据未更改');
            return res.status(404).json({ message: '记录不存在或数据未更改' });
        }
        
        res.json({ message: '流水账记录更新成功' });
    } catch (error) {
        console.error('❌ 更新流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除流水账记录
exports.deleteAccountEntry = async (req, res) => {
    const { entryId } = req.params;

    try {
        console.log(`🗑️ 正在删除流水账记录: ${req.params.entryId}`);
        const success = await AccountEntry.delete(entryId);
        
        if (!success) {
            console.error('❌ 删除流水账记录失败: 记录不存在');
            return res.status(404).json({ message: '记录不存在' });
        }
        
        res.json({ message: '流水账记录删除成功' });
    } catch (error) {
        console.error('❌ 删除流水账记录失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 根据用户ID和年份获取总收入和总支出
exports.getAccountSummaryByUserIdAndYear = async (req, res) => {
    const { userId, year } = req.params;

    try {
        console.log(`🔍 正在获取用户年度收支汇总 (UserID: ${userId}, Year: ${year})`);
        const summary = await AccountEntry.getSummaryByUserIdAndYear(userId, year);
        
        res.json({
            userId,
            year,
            totalIncome: parseFloat(summary.totalIncome),
            totalExpense: parseFloat(summary.totalExpense)
        });
    } catch (error) {
        console.error('❌ 获取用户年度收支汇总失败:', error.message);
        res.status(500).json({ message: '服务器错误' });
    }
};
