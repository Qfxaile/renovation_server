const pool = require('../config/db');

const AccountEntry = {
    getAll: async () => {
        const [rows] = await pool.query('SELECT * FROM AccountEntries');
        return rows;
    },

    getById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM AccountEntries WHERE EntryID = ?', [id]);
        return rows[0];
    },

    getByBookId: async (bookId) => {
        const [rows] = await pool.query('SELECT * FROM AccountEntries WHERE BookID = ?', [bookId]);
        return rows;
    },

    getByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM AccountEntries WHERE UserID = ?', [userId]);
        return rows;
    },

    create: async (data) => {
        const { BookID, UserID, Date, Project, Income, Expense, Notes } = data;
        const [result] = await pool.query(
            'INSERT INTO AccountEntries (BookID, UserID, Date, Project, Income, Expense, Notes) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [BookID, UserID, Date, Project, Income, Expense, Notes]
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
            `UPDATE AccountEntries SET ${fields} WHERE EntryID = ?`,
            values
        );

        return result.affectedRows > 0;
    },

    delete: async (id) => {
        const [result] = await pool.query('DELETE FROM AccountEntries WHERE EntryID = ?', [id]);
        return result.affectedRows > 0;
    },

    // 根据用户ID和年份计算总收入和总支出（基于AccountBooks的Date字段）
    getSummaryByUserIdAndYear: async (userId, year) => {
        const [rows] = await pool.query(`
            SELECT 
                COALESCE(SUM(ae.Income), 0) as totalIncome,
                COALESCE(SUM(ae.Expense), 0) as totalExpense
            FROM AccountEntries ae
            JOIN AccountBooks ab ON ae.BookID = ab.BookID
            WHERE ae.UserID = ? 
            AND YEAR(ab.Date) = ?
        `, [userId, year]);
        
        return rows[0];
    }
};

module.exports = AccountEntry;