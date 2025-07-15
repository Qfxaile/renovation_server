const pool = require('../config/db');

const User = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Users');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [id]);
        return rows[0];
    },

    getByUsername: async (username) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE Username = ?', [username]);
        return rows[0];
    },

    getByRole: async (role) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE Role = ?', [role]);
        return rows;
    },
    
    create: async (data) => {
        const { Username, Password, Role } = data;
        const [result] = await pool.query(
            'INSERT INTO Users (Username, Password, Role) VALUES (?, ?, ?)',
            [Username, Password, Role]
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
            `UPDATE Users SET ${fields} WHERE UserID = ?`,
            values
        );

        if (result.affectedRows === 0) {
            throw new Error(`未找到 ID 为 ${id} 的用户`);
        }
    },

    updatePassword: async (id, newPassword) => {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE Users SET Password = ? WHERE UserID = ?', [hashedPassword, id]);
    },

    delete: async (id) => {
        await pool.query('DELETE FROM Users WHERE UserID = ?', [id]);
    }
};

module.exports = User;