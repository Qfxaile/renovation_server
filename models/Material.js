const pool = require('../config/db');

const Materials = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Materials');
        return rows;
    },
    getAllByProjectId: async (projectId) => {
        const [rows] = await pool.query('SELECT * FROM Materials WHERE ProjectID = ?', [projectId]);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Materials WHERE MaterialID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectID, UserID, Date, MaterialName, Specification, Quantity, UnitPrice, TotalAmount, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO Materials (ProjectID, UserID, Date, MaterialName, Specification, Quantity, UnitPrice, TotalAmount, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ProjectID, UserID, Date, MaterialName, Specification, Quantity, UnitPrice, TotalAmount, Notes]
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

        const [result] = await pool.query(
            `UPDATE Materials SET ${fields} WHERE MaterialID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的材料记录`);
        }
    },
    delete: async (id) => {
        await pool.query('DELETE FROM Materials WHERE MaterialID = ?', [id]);
    }
};

module.exports = Materials;