const pool = require('../config/db');

const Income = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Income');
        return rows;
    },
    getAllByProjectId: async (projectId) => {
        const [rows] = await pool.query('SELECT * FROM Income WHERE ProjectID = ?', [projectId]);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Income WHERE IncomeID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectID, Date, Project, PaymentMethod, Amount, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO Income (ProjectID, Date, Project, PaymentMethod, Amount, Notes) VALUES (?, ?, ?, ?, ?, ?)',
            [ProjectID, Date, Project, PaymentMethod, Amount, Notes]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const fields = Object.keys(data)
            .filter(key => data[key] !== undefined && data[key] !== null && key !== 'id')
            .map(key => `${key} = ?`)
            .join(', ');

        const values = Object.keys(data)
            .filter(key => data[key] !== undefined && data[key] !== null && key !== 'id')
            .map(key => data[key]);

        if (!fields) {
            throw new Error('没有可更新的数据');
        }

        values.push(id);

        // 确保更新语句包含项目名称字段
        const [result] = await pool.query(
            `UPDATE Income SET ${fields} WHERE IncomeID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的收入记录`);
        }
    },
    delete: async (id) => {
        await pool.query('DELETE FROM Income WHERE IncomeID = ?', [id]);
    }
};

module.exports = Income;