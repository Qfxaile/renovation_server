const pool = require('../config/db');

const Project = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Projects');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Projects WHERE ProjectID = ?', [id]);
        return rows[0];
    },
    create: async (data) => {
        const { ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO Projects (ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [ProjectName, ProjectAddress, StartDate, EndDate, ContractAmount, ClientName, ClientContact, Notes]
        );
        return result.insertId;
    },
    update: async (id, data) => {
        const updateData = { ...data };
        if (updateData.StartDate === '') {
          updateData.StartDate = null;
        }
        if (updateData.EndDate === '') {
          updateData.EndDate = null;
        }
        const fields = Object.keys(updateData)
            .filter(key => updateData[key] !== undefined && updateData[key] !== null)
            .map(key => `${key} = ?`)
            .join(', ');

        const values = Object.keys(updateData)
            .filter(key => updateData[key] !== undefined && updateData[key] !== null)
            .map(key => updateData[key]);

        if (!fields) {
            throw new Error('没有可更新的数据');
        }

        values.push(id);

        const [result] = await pool.query(
            `UPDATE Projects SET ${fields} WHERE ProjectID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的项目`);
        }
    },
    delete: async (id) => {
        await pool.query('DELETE FROM Projects WHERE ProjectID = ?', [id]);
    }
};

module.exports = Project;