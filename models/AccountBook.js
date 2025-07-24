const pool = require('../config/db');

const AccountBook = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM AccountBooks');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM AccountBooks WHERE BookID = ?', [id]);
        return rows[0];
    },

    getByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM AccountBooks WHERE UserID = ?', [userId]);
        return rows;
    },

    create: async (data) => {
        const { UserID, Title, Description, Date } = data;
        const [result] = await pool.query(
            'INSERT INTO AccountBooks (UserID, Title, Description, Date) VALUES (?, ?, ?, ?)',
            [UserID, Title, Description, Date]
        );
        return result.insertId;
    },

    update: async (id, data) => {
        const updateData = { ...data };
        if (updateData.Date === '') {
            updateData.Date = null;
        }
        const fields = Object.keys(updateData)
            .filter(key => updateData[key] !== undefined && updateData[key] !== null && key !== 'id')
            .map(key => `${key} = ?`)
            .join(', ');

        const values = Object.keys(updateData)
            .filter(key => updateData[key] !== undefined && updateData[key] !== null && key !== 'id')
            .map(key => updateData[key]);

        if (!fields) {
            throw new Error('没有可更新的数据');
        }

        values.push(id);

        const [result] = await pool.query(
            `UPDATE AccountBooks SET ${fields} WHERE BookID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的账本记录`);
        }
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM AccountBooks WHERE BookID = ?', [id]);
        return result.affectedRows > 0;
    }
};

module.exports = AccountBook;