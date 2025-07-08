const ProjectSummary = require('../models/ProjectSummary');

exports.getProjectSummary = async (req, res) => {
    try {
        console.log('🔍 正在获取所有项目总账单');
        const projectSummaries = await ProjectSummary.getAll();
        res.json(projectSummaries);
    } catch (err) {
        console.error('❌ 获取项目总账单列表失败:', err);
        res.status(500).json({ error: '获取项目总账单列表失败' });
    }
};

exports.getProjectSummaryById = async (req, res) => {
    try {
        console.log(`🔍 正在获取项目总账单: ${req.params.id}`);
        const projectSummary = await ProjectSummary.getById(req.params.id);
        if (!projectSummary) return res.status(404).json({ error: '项目总账单未找到' });
        res.json(projectSummary);
    } catch (err) {
        console.error(`❌ 获取项目总账单失败: ${req.params.id}`, err);
        res.status(500).json({ error: '获取项目总账单失败' });
    }
};