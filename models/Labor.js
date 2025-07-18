const pool = require('../config/db');

const Labor = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Labor');
        return rows;
    },
    getAllByProjectId: async (projectId) => {
        const [rows] = await pool.query('SELECT * FROM Labor WHERE ProjectID = ?', [projectId]);
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Labor WHERE LaborID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectID, UserID, LaborType, Name, WorkDate, WorkDescription, Image, WageRate, DaysWorked, TotalWage, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO Labor (ProjectID, UserID, LaborType, Name, WorkDate, WorkDescription, Image, WageRate, DaysWorked, TotalWage, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [ProjectID, UserID, LaborType, Name, WorkDate, WorkDescription, Image, WageRate, DaysWorked, TotalWage, Notes]
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
            `UPDATE Labor SET ${fields} WHERE LaborID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的工资记录`);
        }
    },
    delete: async (id) => {
        await pool.query('DELETE FROM Labor WHERE LaborID = ?', [id]);
    }
};

module.exports = Labor;