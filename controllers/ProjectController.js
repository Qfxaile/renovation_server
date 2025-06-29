const Project = require('../models/Project');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.getAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: '获取项目列表失败' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.getById(req.params.id);
    if (!project) return res.status(404).json({ error: '项目未找到' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: '获取项目失败' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const id = await Project.create(req.body);
    res.status(201).json({ ProjectID: id });
  } catch (err) {
    res.status(500).json({ error: '创建项目失败' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    await Project.update(req.params.id, req.body);
    res.json({ message: '项目更新成功' });
  } catch (err) {
    res.status(500).json({ error: '更新项目失败' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    await Project.delete(req.params.id);
    res.json({ message: '项目删除成功' });
  } catch (err) {
    res.status(500).json({ error: '删除项目失败' });
  }
};