const pool = require('../config/db');

const ProjectSummary = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM ProjectSummary');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM ProjectSummary WHERE ProjectID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectID, TotalMaterials, ElectricianWages, CarpenterWages, MasonWages, PainterWages, OtherExpensesTotal, TotalExpenses, TotalIncome, TotalProfit } = data;
        const [result] = await pool.query(
            'INSERT INTO ProjectSummary (ProjectID, TotalMaterials, ElectricianWages, CarpenterWages, MasonWages, PainterWages, OtherExpensesTotal, TotalExpenses, TotalIncome, TotalProfit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ProjectID, TotalMaterials, ElectricianWages, CarpenterWages, MasonWages, PainterWages, OtherExpensesTotal, TotalExpenses, TotalIncome, TotalProfit]
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
            `UPDATE ProjectSummary SET ${fields} WHERE ProjectID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的项目总账单`);
        }
    },
    delete: async (id) => {
        await pool.query('DELETE FROM ProjectSummary WHERE ProjectID = ?', [id]);
    }
};

module.exports = ProjectSummary;