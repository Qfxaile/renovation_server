const Labor = require('../models/Labor');
const formatDate = require('../utils/dateUtils');

exports.getAllLaborRecords = async (req, res) => {
    try {
        console.log('🔍 正在获取所有工资记录');
        const laborRecords = await Labor.getAll();
        
        // 格式化所有工资记录中的工作日期
        const formattedLaborRecords = laborRecords.map(record => ({
            ...record,
            WorkDate: record.WorkDate ? formatDate(new Date(record.WorkDate)) : ''
        }));
        
        res.json(formattedLaborRecords);
    } catch (err) {
        console.error('❌ 获取工资记录列表失败:', err);
        res.status(500).json({ error: '获取工资记录列表失败' });
    }
};

exports.getLaborRecordsByProjectId = async (req, res) => {
    try {
        console.log(`🔍 正在获取项目 ${req.params.projectId} 的工资记录`);
        const laborRecords = await Labor.getAllByProjectId(req.params.projectId);
        
        // 格式化所有工资记录中的工作日期
        const formattedLaborRecords = laborRecords.map(record => ({
            ...record,
            WorkDate: record.WorkDate ? formatDate(new Date(record.WorkDate)) : ''
        }));
        
        res.json(formattedLaborRecords);
    } catch (err) {
        console.error(`❌ 获取项目工资记录失败: ${req.params.projectId}`, err);
        res.status(500).json({ error: '获取项目工资记录失败' });
    }
};

exports.getLaborRecordById = async (req, res) => {
    try {
        console.log(`🔍 正在获取工资记录详情: ${req.params.id}`);
        const laborRecord = await Labor.getById(req.params.id);
        if (!laborRecord) return res.status(404).json({ error: '工资记录未找到' });
        
        // 格式化工作日期
        const formattedLaborRecord = {
            ...laborRecord,
            WorkDate: laborRecord.WorkDate ? formatDate(new Date(laborRecord.WorkDate)) : ''
        };
        
        res.json(formattedLaborRecord);
    } catch (err) {
        console.error(`❌ 获取工资记录失败: ${req.params.id}`, err);
        res.status(500).json({ error: '获取工资记录失败' });
    }
};

exports.createLaborRecord = async (req, res) => {
    try {
        console.log('➕ 正在创建新工资记录:', req.body);
        const id = await Labor.create(req.body);
        res.status(201).json({ LaborID: id });
    } catch (err) {
        console.error('❌ 创建工资记录失败:', err);
        res.status(500).json({ error: '创建工资记录失败' });
    }
};

exports.updateLaborRecord = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        console.log('🔧 正在更新工资记录:', { id, updateData });
        await Labor.update(id, updateData);
        res.json({ message: '工资记录更新成功' });
    } catch (err) {
        console.error('❌ 更新工资记录失败:', err);
        res.status(500).json({ error: '更新工资记录失败' });
    }
};

exports.deleteLaborRecord = async (req, res) => {
    try {
        console.log(`🗑️ 正在删除工资记录: ${req.params.id}`);
        await Labor.delete(req.params.id);
        res.json({ message: '工资记录删除成功' });
    } catch (err) {
        console.error(`❌ 删除工资记录失败: ${req.params.id}`, err);
        res.status(500).json({ error: '删除工资记录失败' });
    }
};