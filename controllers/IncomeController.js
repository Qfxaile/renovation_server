const Income = require('../models/Income');
const formatDate = require('../utils/dateUtils');

exports.getAllIncomes = async (req, res) => {
    try {
        console.log('🔍 正在获取所有收入');
        const incomes = await Income.getAll();
        
        // 格式化所有收入记录中的日期
        const formattedIncomes = incomes.map(income => ({
            ...income,
            Date: formatDate(new Date(income.Date))
        }));
        
        res.json(formattedIncomes);
    } catch (err) {
        console.error('❌ 获取收入列表失败:', err);
        res.status(500).json({ error: '获取收入列表失败' });
    }
};

exports.getIncomesByProjectId = async (req, res) => {
    try {
        console.log(`🔍 正在获取项目 ${req.params.projectId} 的收入`);
        const incomes = await Income.getAllByProjectId(req.params.projectId);
        res.json(incomes);
    } catch (err) {
        console.error(`❌ 获取项目收入失败: ${req.params.projectId}`, err);
        res.status(500).json({ error: '获取项目收入失败' });
    }
};

exports.getIncomeById = async (req, res) => {
    try {
        console.log(`🔍 正在获取收入详情: ${req.params.id}`);
        const income = await Income.getById(req.params.id);
        if (!income) return res.status(404).json({ error: '收入记录未找到' });
        res.json(income);
    } catch (err) {
        console.error(`❌ 获取收入失败: ${req.params.id}`, err);
        res.status(500).json({ error: '获取收入失败' });
    }
};

exports.createIncome = async (req, res) => {
    try {
        console.log('➕ 正在创建新收入:', req.body);
        const id = await Income.create(req.body);
        res.status(201).json({ IncomeID: id });
    } catch (err) {
        console.error('❌ 创建收入失败:', err);
        res.status(500).json({ error: '创建收入失败' });
    }
};

exports.updateIncome = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        console.log('🔧 正在更新收入:', { id, updateData });
        await Income.update(id, updateData);
        res.json({ message: '收入更新成功' });
    } catch (err) {
        console.error('❌ 更新收入失败:', err);
        res.status(500).json({ error: '更新收入失败' });
    }
};

exports.deleteIncome = async (req, res) => {
    try {
        console.log(`🗑️ 正在删除收入: ${req.params.id}`);
        await Income.delete(req.params.id);
        res.json({ message: '收入删除成功' });
    } catch (err) {
        console.error(`❌ 删除收入失败: ${req.params.id}`, err);
        res.status(500).json({ error: '删除收入失败' });
    }
};