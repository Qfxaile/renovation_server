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
};

module.exports = ProjectSummary;