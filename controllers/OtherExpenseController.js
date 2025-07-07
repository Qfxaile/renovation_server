const OtherExpenses = require('../models/OtherExpense');
const formatDate = require('../utils/dateUtils');

exports.getAllOtherExpenses = async (req, res) => {
    try {
        console.log('🔍 正在获取所有其他支出');
        const otherExpenses = await OtherExpenses.getAll();
        
        // 格式化所有其他支出记录中的日期
        const formattedOtherExpenses = otherExpenses.map(expense => ({
            ...expense,
            Date: expense.Date ? formatDate(new Date(expense.Date)) : ''
        }));
        
        res.json(formattedOtherExpenses);
    } catch (err) {
        console.error('❌ 获取其他支出列表失败:', err);
        res.status(500).json({ error: '获取其他支出列表失败' });
    }
};

exports.getOtherExpensesByProjectId = async (req, res) => {
    try {
        console.log(`🔍 正在获取项目 ${req.params.projectId} 的其他支出`);
        const otherExpenses = await OtherExpenses.getAllByProjectId(req.params.projectId);
        
        // 格式化所有其他支出记录中的日期
        const formattedOtherExpenses = otherExpenses.map(expense => ({
            ...expense,
            Date: expense.Date ? formatDate(new Date(expense.Date)) : ''
        }));
        
        res.json(formattedOtherExpenses);
    } catch (err) {
        console.error(`❌ 获取项目其他支出失败: ${req.params.projectId}`, err);
        res.status(500).json({ error: '获取项目其他支出失败' });
    }
};

exports.getOtherExpenseById = async (req, res) => {
    try {
        console.log(`🔍 正在获取其他支出详情: ${req.params.id}`);
        const otherExpense = await OtherExpenses.getById(req.params.id);
        if (!otherExpense) return res.status(404).json({ error: '其他支出记录未找到' });
        
        // 格式化日期
        const formattedOtherExpense = {
            ...otherExpense,
            Date: otherExpense.Date ? formatDate(new Date(otherExpense.Date)) : ''
        };
        
        res.json(formattedOtherExpense);
    } catch (err) {
        console.error(`❌ 获取其他支出失败: ${req.params.id}`, err);
        res.status(500).json({ error: '获取其他支出失败' });
    }
};

exports.createOtherExpense = async (req, res) => {
    try {
        console.log('➕ 正在创建新其他支出:', req.body);
        const id = await OtherExpenses.create(req.body);
        res.status(201).json({ ExpenseID: id });
    } catch (err) {
        console.error('❌ 创建其他支出失败:', err);
        res.status(500).json({ error: '创建其他支出失败' });
    }
};

exports.updateDynamicExpense = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        console.log('🔧 正在更新其他支出:', { id, updateData });
        await OtherExpenses.update(id, updateData);
        res.json({ message: '其他支出更新成功' });
    } catch (err) {
        console.error('❌ 更新其他支出失败:', err);
        res.status(500).json({ error: '更新其他支出失败' });
    }
};

exports.deleteOtherExpense = async (req, res) => {
    try {
        console.log(`🗑️ 正在删除其他支出: ${req.params.id}`);
        await OtherExpenses.delete(req.params.id);
        res.json({ message: '其他支出删除成功' });
    } catch (err) {
        console.error(`❌ 删除其他支出失败: ${req.params.id}`, err);
        res.status(500).json({ error: '删除其他支出失败' });
    }
};