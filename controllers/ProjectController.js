const Project = require('../models/Project');
const formatDate = require('../utils/dateUtils');

exports.getAllProjects = async (req, res) => {
  try {
    console.log('🔍 正在获取所有项目'); // 添加日志输出
    const projects = await Project.getAll();
    
    // 格式化所有项目中的日期
    const formattedProjects = projects.map(project => ({
      ...project,
      StartDate: project.StartDate ? formatDate(new Date(project.StartDate)) : '',
      EndDate: project.EndDate ? formatDate(new Date(project.EndDate)) : ''
    }));
    
    res.json(formattedProjects);
  } catch (err) {
    console.error('❌ 获取项目列表失败:', err); // 打印完整错误堆栈
    res.status(500).json({ error: '获取项目列表失败' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    console.log(`🔍 正在获取项目详情: ${req.params.id}`); // 添加日志输出
    const project = await Project.getById(req.params.id);
    if (!project) return res.status(404).json({ error: '项目未找到' });
    
    // 格式化日期
    const formattedProject = {
      ...project,
      StartDate: project.StartDate ? formatDate(new Date(project.StartDate)) : '',
      EndDate: project.EndDate ? formatDate(new Date(project.EndDate)) : ''
    };
    
    res.json(formattedProject);
  } catch (err) {
    console.error(`❌ 获取项目失败: ${req.params.id}`, err); // 打印完整错误堆栈
    res.status(500).json({ error: '获取项目失败' });
  }
};

exports.createProject = async (req, res) => {
  try {
    console.log('➕ 正在创建新项目:', req.body); // 添加调试日志
    const id = await Project.create(req.body);
    res.status(201).json({ ProjectID: id });
  } catch (err) {
    console.error('❌ 创建项目失败:', err); // 打印完整错误堆栈
    res.status(500).json({ error: '创建项目失败' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    console.log('🔧 正在更新项目:', { id, updateData }); // 添加调试日志
    await Project.update(id, updateData);
    res.json({ message: '项目更新成功' });
  } catch (err) {
    console.error('❌ 更新项目失败:', err); // 打印完整错误堆栈
    res.status(500).json({ error: '更新项目失败' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    console.log(`🗑️ 正在删除项目: ${req.params.id}`); // 添加日志输出
    await Project.delete(req.params.id);
    res.json({ message: '项目删除成功' });
  } catch (err) {
    console.error(`❌ 删除项目失败: ${req.params.id}`, err); // 打印完整错误堆栈
    res.status(500).json({ error: '删除项目失败' });
  }
};