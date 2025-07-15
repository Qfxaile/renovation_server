const pool = require('../config/db');

const OtherExpenses = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM OtherExpenses');
        return rows;
    },
    getAllByProjectId: async (projectId) => {
        const [rows] = await pool.query('SELECT * FROM OtherExpenses WHERE ProjectID = ?', [projectId]);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM OtherExpenses WHERE ExpenseID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectID, UserID, Date, ExpenseType, ExpenseDescription, Amount, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO OtherExpenses (ProjectID, UserID, Date, ExpenseType, ExpenseDescription, Amount, Notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [ProjectID, UserID, Date, ExpenseType, ExpenseDescription, Amount, Notes]
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
            `UPDATE OtherExpenses SET ${fields} WHERE ExpenseID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的支出记录`);
        }
    },
    delete: async (id) => {
        await pool.query('DELETE FROM OtherExpenses WHERE ExpenseID = ?', [id]);
    }
};

module.exports = OtherExpenses;