const Materials = require('../models/Material');
const formatDate = require('../utils/dateUtils');

exports.getAllMaterials = async (req, res) => {
    try {
        console.log('🔍 正在获取所有材料');
        const materials = await Materials.getAll();
        
        // 格式化所有材料记录中的日期
        const formattedMaterials = materials.map(material => ({
            ...material,
            Date: formatDate(new Date(material.Date))
        }));
        
        res.json(formattedMaterials);
    } catch (err) {
        console.error('❌ 获取材料列表失败:', err);
        res.status(500).json({ error: '获取材料列表失败' });
    }
};

exports.getMaterialsByProjectId = async (req, res) => {
    try {
        console.log(`🔍 正在获取项目 ${req.params.projectId} 的材料`);
        const materials = await Materials.getAllByProjectId(req.params.projectId);
        res.json(materials);
    } catch (err) {
        console.error(`❌ 获取项目材料失败: ${req.params.projectId}`, err);
        res.status(500).json({ error: '获取项目材料失败' });
    }
};

exports.getMaterialById = async (req, res) => {
    try {
        console.log(`🔍 正在获取材料详情: ${req.params.id}`);
        const material = await Materials.getById(req.params.id);
        if (!material) return res.status(404).json({ error: '材料记录未找到' });
        res.json(material);
    } catch (err) {
        console.error(`❌ 获取材料失败: ${req.params.id}`, err);
        res.status(500).json({ error: '获取材料失败' });
    }
};

exports.createMaterial = async (req, res) => {
    try {
        console.log('➕ 正在创建新材料:', req.body);
        const id = await Materials.create(req.body);
        res.status(201).json({ MaterialID: id });
    } catch (err) {
        console.error('❌ 创建材料失败:', err);
        res.status(500).json({ error: '创建材料失败' });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;
        console.log('🔧 正在更新材料:', { id, updateData });
        await Materials.update(id, updateData);
        res.json({ message: '材料更新成功' });
    } catch (err) {
        console.error('❌ 更新材料失败:', err);
        res.status(500).json({ error: '更新材料失败' });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        console.log(`🗑️ 正在删除材料: ${req.params.id}`);
        await Materials.delete(req.params.id);
        res.json({ message: '材料删除成功' });
    } catch (err) {
        console.error(`❌ 删除材料失败: ${req.params.id}`, err);
        res.status(500).json({ error: '删除材料失败' });
    }
};