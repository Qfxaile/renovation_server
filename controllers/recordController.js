const Record = require('../models/Record');
const jwt = require('jsonwebtoken');

// 添加记账记录
exports.createRecord = async (req, res) => {
  try {
    const userId = req.user.id; // 从认证获取
    const record = { ...req.body, userId };
    const recordId = await Record.create(record);
    res.status(201).json({ id: recordId, message: '记录添加成功' });
  } catch (error) {
    res.status(500).json({ error: '服务器内部错误' });
  }
};

// 获取用户记录
exports.getRecords = async (req, res) => {
  try {
    const userId = req.user.id;
    const records = await Record.findByUser(userId);
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: '获取记录失败' });
  }
};