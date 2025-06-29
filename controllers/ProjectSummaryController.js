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

exports.createProjectSummary = async (req, res) => {
    try {
        console.log('➕ 正在创建新项目总账单:', req.body);
        const id = await ProjectSummary.create(req.body);
        res.status(201).json({ ProjectID: id });
    } catch (err) {
        console.error('❌ 创建项目总账单失败:', err);
        res.status(500).json({ error: '创建项目总账单失败' });
    }
};

exports.updateProjectSummary = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        console.log('🔧 正在更新项目总账单:', { id, updateData });
        await ProjectSummary.update(id, updateData);
        res.json({ message: '项目总账单更新成功' });
    } catch (err) {
        console.error('❌ 更新项目总账单失败:', err);
        res.status(500).json({ error: '更新项目总账单失败' });
    }
};

exports.deleteProjectSummary = async (req, res) => {
    try {
        console.log(`🗑️ 正在删除项目总账单: ${req.params.id}`);
        await ProjectSummary.delete(req.params.id);
        res.json({ message: '项目总账单删除成功' });
    } catch (err) {
        console.error(`❌ 删除项目总账单失败: ${req.params.id}`, err);
        res.status(500).json({ error: '删除项目总账单失败' });
    }
};